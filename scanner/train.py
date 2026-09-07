#!/usr/bin/env python3
"""
Script para entrenar modelo YOLO con imágenes de productos de la tienda.
Ejecutar antes del escaneo para personalizar la detección.
"""

import os
from pathlib import Path
from ultralytics import YOLO

def train_model(
    data_yaml: str = "dataset/data.yaml",
    epochs: int = 50,
    imgsz: int = 640,
    model_size: str = "n"
):
    """
    Entrena un modelo YOLOv8 personalizado.

    Args:
        data_yaml: Ruta al archivo YAML del dataset
        epochs: Número de épocas de entrenamiento
        imgsz: Tamaño de imagen
        model_size: n (nano), s (small), m (medium), l (large)
    """
    print(f"🚀 Entrenando YOLOv8-{model_size}...")

    model = YOLO(f"yolov8{model_size}.pt")

    results = model.train(
        data=data_yaml,
        epochs=epochs,
        imgsz=imgsz,
        project="scanner/weights",
        name="train",
        exist_ok=True,
        verbose=True
    )

    best_model_path = f"scanner/weights/train/weights/best.pt"
    print(f"✅ Entrenamiento completo. Modelo guardado en: {best_model_path}")

    return best_model_path

if __name__ == "__main__":
    import sys

    epochs = int(sys.argv[1]) if len(sys.argv) > 1 else 50
    train_model(epochs=epochs)
