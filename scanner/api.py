from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import json
import base64
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = Path(__file__).parent / "uploads"
UPLOAD_FOLDER.mkdir(exist_ok=True)

os.environ["YOLO_VERBOSE"] = "False"

def load_model():
    from ultralytics import YOLO
    model_path = Path(__file__).parent / "weights" / "best.pt"
    if model_path.exists():
        return YOLO(str(model_path))
    return YOLO("yolov8n.pt")

model = None

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "OK", "service": "scanner"})

@app.route("/scan", methods=["POST"])
def scan():
    global model

    if model is None:
        model = load_model()

    data = request.get_json()

    if "image" in data:
        image_data = data["image"]
        if "," in image_data:
            image_data = image_data.split(",")[1]

        image_bytes = base64.b64decode(image_data)
        image_path = UPLOAD_FOLDER / "temp_scan.jpg"
        with open(image_path, "wb") as f:
            f.write(image_bytes)
        image_path = str(image_path)
    elif "image_path" in data:
        image_path = data["image_path"]
    else:
        return jsonify({"success": False, "error": "No se proporcionó imagen"}), 400

    try:
        results = model(image_path, verbose=False)

        detections = []
        product_counts = {}

        for result in results:
            boxes = result.boxes
            for box in boxes:
                class_id = int(box.cls[0])
                class_name = result.names[class_id]
                confidence = float(box.conf[0])

                if class_name in product_counts:
                    product_counts[class_name] += 1
                else:
                    product_counts[class_name] = 1

                detections.append({
                    "class": class_name,
                    "confidence": round(confidence, 2),
                    "bbox": [round(x, 2) for x in box.xyxy[0].tolist()]
                })

        detected_products = [
            {"name": name, "count": count}
            for name, count in product_counts.items()
        ]

        return jsonify({
            "success": True,
            "total_products": sum(product_counts.values()),
            "unique_products": len(product_counts),
            "detections": detections,
            "products": detected_products
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Error en el procesamiento"
        }), 500

@app.route("/products", methods=["GET"])
def list_products():
    inventory_dir = Path(__file__).parent / "assets" / "inventario"
    products = []

    if inventory_dir.exists():
        for item in inventory_dir.iterdir():
            if item.is_dir():
                products.append({
                    "name": item.name,
                    "path": str(item),
                    "image_count": len(list(item.glob("*.jpg"))) + len(list(item.glob("*.png")))
                })

    return jsonify({"success": True, "products": products})

if __name__ == "__main__":
    print("🚀 Iniciando Scanner API...")
    app.run(host="0.0.0.0", port=5000, debug=True)
