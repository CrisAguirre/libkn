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

CONF_THRESHOLD = float(os.environ.get("SCANNER_CONF_THRESHOLD", "0.5"))
ALLOW_COCO_FALLBACK = os.environ.get("SCANNER_ALLOW_COCO_FALLBACK", "0") == "1"
AUTO_CONF_WORLD = float(os.environ.get("SCANNER_AUTO_CONF_WORLD", "0.15"))
AUTO_CONF_COCO = float(os.environ.get("SCANNER_AUTO_CONF_COCO", "0.25"))

def load_model():
    from ultralytics import YOLO
    model_path = Path(__file__).parent / "weights" / "best.pt"
    if model_path.exists():
        m = YOLO(str(model_path))
        return m, {"model_used": "best.pt", "fallback": False}
    if ALLOW_COCO_FALLBACK:
        m = YOLO("yolov8n.pt")
        return m, {"model_used": "yolov8n.pt (COCO generico, NO apto para inventario)", "fallback": True}
    return None, {"model_used": None, "fallback": False, "error": "Modelo no entrenado: falta scanner/weights/best.pt"}

model = None
model_info = {"model_used": None, "fallback": False}

@app.route("/health", methods=["GET"])
def health():
    weights_ok = (Path(__file__).parent / "weights" / "best.pt").exists()
    return jsonify({
        "status": "OK",
        "service": "scanner",
        "model_trained": weights_ok,
        "model_used": model_info.get("model_used"),
        "fallback": model_info.get("fallback", False),
        "conf_threshold": CONF_THRESHOLD,
    })

@app.route("/scan", methods=["POST"])
def scan():
    global model, model_info

    if model is None:
        model, model_info = load_model()
        if model is None:
            return jsonify({
                "success": False,
                "error": model_info.get("error", "Modelo no disponible"),
                "message": "Entrena el modelo (python train.py) y coloca weights/best.pt antes de contar existencias",
            }), 500

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
        product_stats = {}
        filtered_low_conf = 0

        for result in results:
            boxes = result.boxes
            for box in boxes:
                class_id = int(box.cls[0])
                class_name = result.names[class_id]
                confidence = float(box.conf[0])

                if confidence < CONF_THRESHOLD:
                    filtered_low_conf += 1
                    continue

                st = product_stats.setdefault(class_name, {"count": 0, "conf_sum": 0.0, "conf_min": 1.0})
                st["count"] += 1
                st["conf_sum"] += confidence
                st["conf_min"] = min(st["conf_min"], confidence)

                detections.append({
                    "class": class_name,
                    "confidence": round(confidence, 2),
                    "bbox": [round(x, 2) for x in box.xyxy[0].tolist()]
                })

        detected_products = [
            {
                "name": name,
                "count": st["count"],
                "confidence": round(st["conf_sum"] / st["count"], 2),
                "min_confidence": round(st["conf_min"], 2),
            }
            for name, st in product_stats.items()
        ]

        return jsonify({
            "success": True,
            "total_products": sum(s["count"] for s in product_stats.values()),
            "unique_products": len(product_stats),
            "detections": detections,
            "products": detected_products,
            "model_used": model_info.get("model_used"),
            "fallback": model_info.get("fallback", False),
            "conf_threshold": CONF_THRESHOLD,
            "filtered_low_conf": filtered_low_conf,
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Error en el procesamiento"
        }), 500

@app.route("/scan-auto", methods=["POST"])
def scan_auto():
    """Conteo automatico sin best.pt (YOLO-World retail + corroboracion COCO).

    Acepta {image: base64} o {image_path}. Retorna unidades por foto con
    tier de fiabilidad (ALTA/MEDIA/BAJA). Las fotos BAJA (abarrotes a granel)
    deben contarse manual por filas usando la foto como evidencia.
    """
    try:
        from auto_count import auto_count
    except Exception as e:
        return jsonify({"success": False, "error": f"No se pudo cargar el motor auto: {e}"}), 500

    data = request.get_json(force=True, silent=True) or {}

    annotate = bool(data.get("annotate", False))
    if "image" in data:
        image_data = data["image"]
        if "," in image_data:
            image_data = image_data.split(",")[1]
        image_bytes = base64.b64decode(image_data)
        image_path = UPLOAD_FOLDER / "temp_scan_auto.jpg"
        with open(image_path, "wb") as f:
            f.write(image_bytes)
        image_path = str(image_path)
    elif "image_path" in data:
        image_path = data["image_path"]
    else:
        return jsonify({"success": False, "error": "No se proporcionó imagen"}), 400

    try:
        result = auto_count(
            image_path,
            conf_world=float(data.get("conf_world", AUTO_CONF_WORLD)),
            conf_coco=float(data.get("conf_coco", AUTO_CONF_COCO)),
            annotate=annotate,
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e), "message": "Error en conteo automatico"}), 500


@app.route("/zones-report", methods=["GET"])
def zones_report():
    import json as _json
    report_path = Path(__file__).parent / "batch_result.json"
    if not report_path.exists():
        return jsonify({"success": False, "error": "Sin reporte batch: ejecuta el conteo sobre src/stock primero"}), 404
    try:
        data = _json.loads(report_path.read_text(encoding="utf-8"))
        return jsonify({"success": True, **data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


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
