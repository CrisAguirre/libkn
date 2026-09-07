# Scanner de Inventario

Sistema de detección de productos mediante visión computacional usando YOLOv8.

## Estructura

```
scanner/
├── api.py                 # Servidor Flask (alternativo)
├── scan.py                # Script CLI de escaneo
├── train.py               # Script de entrenamiento
├── requirements.txt       # Dependencias Python
├── assets/
│   └── inventario/        # Imágenes de productos por categoría
│       ├── producto_1/
│       └── producto_2/
├── weights/               # Modelos entrenados (generado)
│   └── best.pt
└── dataset/               # Dataset para entrenamiento
    ├── train/
    └── val/
```

## Instalación

```bash
cd scanner
pip install -r requirements.txt
```

## Uso Rápido

### 1. Iniciar el servidor (automático via Node.js)

El servidor Node.js inicia automáticamente el scanner:

```bash
cd libkn
npm run dev
```

### 2. Escanear imagen (Base64)

```bash
POST /api/scanner/scan
{
  "image": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

### 3. Escanear y actualizar inventario automáticamente

```bash
POST /api/scanner/scan-update
{
  "image": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

**Respuesta:**
```json
{
  "success": true,
  "total_products": 15,
  "unique_products": 3,
  "products": [
    { "name": "coca_cola", "count": 10 },
    { "name": "sprite", "count": 5 }
  ],
  "stock_updated": true,
  "updated_products": [
    { "product": "Coca-Cola 500ml", "old_stock": 8, "new_stock": 10, "difference": 2 }
  ]
}
```

## Entrenamiento del Modelo

### 1. Preparar dataset

Coloca imágenes en:
- `scanner/dataset/train/` - Imágenes de entrenamiento
- `scanner/dataset/val/` - Imágenes de validación

Cada imagen debe tener su archivo `.txt` de labels en formato YOLO.

### 2. Configurar data.yaml

Edita `scanner/dataset/data.yaml` con los nombres de tus productos:

```yaml
names:
  0: coca_cola
  1: sprite
  2: fanta
```

### 3. Entrenar

```bash
cd scanner
python train.py 50
```

## API Endpoints

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/scanner/status` | Estado del scanner | Sí |
| GET | `/api/scanner/inventory` | Lista categorías en assets | Sí |
| POST | `/api/scanner/start` | Iniciar servidor Python | Admin |
| POST | `/api/scanner/stop` | Detener servidor Python | Admin |
| POST | `/api/scanner/scan` | Escanear imagen | Sí |
| POST | `/api/scanner/scan-update` | Escanear y actualizar stock | Admin/Operador |

## Notas

- El scanner usa YOLOv8n (nano) por defecto para velocidad
- Para mejor precisión, entrena con 50+ imágenes por producto
- Las fotos de alta calidad mejoran significativamente la detección
