import sys
import json
import os
from pathlib import Path
from ultralytics import YOLO

def scan_inventory(image_path, assets_dir="assets/inventario"):
    """
    Escanea una imagen usando YOLOv8 para contar productos.
    Returns JSON con los productos detectados y sus cantidades.
    """
    try:
        model_path = Path(__file__).parent / "weights" / "best.pt"

        if not model_path.exists():
            model_path = "yolov8n.pt"

        model = YOLO(str(model_path))

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
                    "bbox": box.xyxy[0].tolist()
                })

        detected_products = [
            {"name": name, "count": count}
            for name, count in product_counts.items()
        ]

        response = {
            "success": True,
            "total_products": sum(product_counts.values()),
            "unique_products": len(product_counts),
            "detections": detections,
            "products": detected_products,
            "image_path": image_path
        }

        print(json.dumps(response, ensure_ascii=False))
        return response

    except Exception as e:
        error_response = {
            "success": False,
            "error": str(e),
            "message": "Error en el procesamiento de la imagen"
        }
        print(json.dumps(error_response, ensure_ascii=False))
        return error_response

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No se proporcionó ruta de imagen"}))
        sys.exit(1)

    image_path = sys.argv[1]
    assets_dir = sys.argv[2] if len(sys.argv) > 2 else "assets/inventario"

    if not os.path.exists(image_path):
        print(json.dumps({"success": False, "error": f"Archivo no encontrado: {image_path}"}))
        sys.exit(1)

    scan_inventory(image_path, assets_dir)
