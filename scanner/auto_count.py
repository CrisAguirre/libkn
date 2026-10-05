"""Motor de conteo automatico para estanterias reales (sin best.pt).

Estrategia validada sobre 53 fotos de src/stock (2026-10-05):
- YOLO-World open-vocabulary con prompts retail -> unidades por foto.
- YOLOv8n COCO como respaldo/corroboracion.
- Regla de zona: fotos con igual numero base (1, 1b -> zona 1;
  40, 40a, 40b -> zona 40) son planos complementarios y SE SUMAN.
- Tiers de fiabilidad por foto/zona:
    ALTA: >=20 unidades y dominio botellas (licores, aseo) -> apto auto.
    MEDIA: 10-19 unidades -> auto + validacion visual rapida.
    BAJA: <10 unidades (abarrotes a granel: latas/bolsas apiladas sin
      separacion) -> requiere conteo manual por filas (filas x columnas)
      usando la foto como evidencia; la IA no segmenta esos apilados.

Uso:
    from auto_count import auto_count
    res = auto_count("C:/.../src/stock/25.jpg", annotate=True)
"""
import base64
from pathlib import Path

import cv2

RETAIL_PROMPTS = ["bottle", "can", "food bag", "packet", "cardboard box", "jar"]

_world_model = None
_coco_model = None


def _get_world():
    global _world_model
    if _world_model is None:
        from ultralytics import YOLO
        _world_model = YOLO("yolov8s-worldv2.pt")
        _world_model.set_classes(RETAIL_PROMPTS)
    return _world_model


def _get_coco():
    global _coco_model
    if _coco_model is None:
        from ultralytics import YOLO
        _coco_model = YOLO("yolov8n.pt")
    return _coco_model


def reliability_tier(total_units: int, break_world: dict) -> str:
    bottles = break_world.get("bottle", 0)
    if total_units >= 20 and bottles >= total_units * 0.5:
        return "ALTA"
    if total_units >= 10:
        return "MEDIA"
    return "BAJA"


def auto_count(image_path, conf_world=0.15, conf_coco=0.25, imgsz=1280, annotate=False):
    """Cuenta unidades en una foto. Retorna dict serializable a JSON."""
    image_path = str(image_path)
    world = _get_world()
    coco = _get_coco()

    rw = world(image_path, verbose=False, conf=conf_world, imgsz=imgsz)[0]
    break_world = {}
    detections = []
    for b in rw.boxes:
        name = rw.names[int(b.cls[0])]
        conf = float(b.conf[0])
        break_world[name] = break_world.get(name, 0) + 1
        detections.append({
            "class": name,
            "confidence": round(conf, 2),
            "bbox": [round(x, 2) for x in b.xyxy[0].tolist()],
        })
    world_total = sum(break_world.values())

    rc = coco(image_path, verbose=False, conf=conf_coco, imgsz=imgsz)[0]
    break_coco = {}
    for b in rc.boxes:
        name = rc.names[int(b.cls[0])]
        break_coco[name] = break_coco.get(name, 0) + 1
    coco_total = sum(break_coco.values())

    tier = reliability_tier(world_total, break_world)

    result = {
        "success": True,
        "engine": "yolo-world + yolov8n",
        "total_units": world_total,
        "products": [
            {"name": k, "count": v} for k, v in sorted(break_world.items(), key=lambda x: -x[1])
        ],
        "corroboration_coco_total": coco_total,
        "corroboration_coco": break_coco,
        "reliability": tier,
        "needs_manual_rows": tier == "BAJA",
        "detections": detections,
        "image_path": image_path,
    }

    if annotate:
        ann = rw.plot()
        ok, buf = cv2.imencode(".jpg", ann, [cv2.IMWRITE_JPEG_QUALITY, 82])
        if ok:
            # Downscale para preview liviano en frontend
            result["annotated_preview"] = base64.b64encode(bytes(buf)).decode("ascii")

    return result
