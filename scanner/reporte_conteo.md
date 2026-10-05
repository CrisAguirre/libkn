# Conteo de inventarios por fotografia - Reporte batch (2026-10-05)

Motor: YOLO-World open-vocabulary (bottle, can, food bag, packet, cardboard box, jar) + corroboracion YOLOv8n COCO.
Fuente: `libkn/src/stock/` - 53 fotos, 40 zonas. Regla confirmada: planos con igual numero base son complementarios y SE SUMAN.

Totales: auto=1108 unidades, coco=639.

| Zona | Fotos | Auto (suma) | COCO | Fiabilidad | Accion |
|---|---|---|---|---|---|
| 1 | 1.jpg, 1b.jpg | 24 | 12 | ALTA (auto OK) | Aplicar auto |
| 2 | 2.jpg, 2b.jpg | 13 | 19 | MEDIA (auto + validacion visual) | Validar visual |
| 3 | 3.jpg, 3b.jpg | 11 | 14 | MEDIA (auto + validacion visual) | Validar visual |
| 4 | 4.jpg, 4b.jpg | 85 | 86 | ALTA (auto OK) | Aplicar auto |
| 5 | 5.jpg | 9 | 5 | BAJA (conteo manual por filas) | Conteo filas x columnas |
| 6 | 6.jpg, 6b.jpg | 31 | 14 | MEDIA (auto + validacion visual) | Validar visual |
| 7 | 7.jpg | 12 | 3 | MEDIA (auto + validacion visual) | Validar visual |
| 8 | 8.jpg | 6 | 1 | BAJA (conteo manual por filas) | Conteo filas x columnas |
| 9 | 9.jpg | 11 | 1 | MEDIA (auto + validacion visual) | Validar visual |
| 10 | 10.jpg, 10b.jpg | 62 | 34 | ALTA (auto OK) | Aplicar auto |
| 11 | 11.jpg | 17 | 3 | MEDIA (auto + validacion visual) | Validar visual |
| 12 | 12.jpg, 12b.jpg | 62 | 23 | ALTA (auto OK) | Aplicar auto |
| 13 | 13.jpg, 13b.jpg | 58 | 15 | ALTA (auto OK) | Aplicar auto |
| 14 | 14.jpg, 14b.jpg | 83 | 58 | ALTA (auto OK) | Aplicar auto |
| 15 | 15.jpg | 7 | 1 | BAJA (conteo manual por filas) | Conteo filas x columnas |
| 16 | 16.jpg | 17 | 7 | MEDIA (auto + validacion visual) | Validar visual |
| 17 | 17.jpg, 17b.jpg | 33 | 23 | MEDIA (auto + validacion visual) | Validar visual |
| 18 | 18.jpg | 12 | 5 | MEDIA (auto + validacion visual) | Validar visual |
| 19 | 19.jpg | 20 | 3 | ALTA (auto OK) | Aplicar auto |
| 20 | 20.jpg | 20 | 11 | ALTA (auto OK) | Aplicar auto |
| 21 | 21.jpg | 4 | 0 | BAJA (conteo manual por filas) | Conteo filas x columnas |
| 22 | 22.jpg | 14 | 0 | MEDIA (auto + validacion visual) | Validar visual |
| 23 | 23.jpg | 21 | 2 | MEDIA (auto + validacion visual) | Validar visual |
| 24 | 24.jpg | 36 | 0 | MEDIA (auto + validacion visual) | Validar visual |
| 25 | 25.jpg, 25b.jpg | 108 | 82 | ALTA (auto OK) | Aplicar auto |
| 26 | 26.jpg | 2 | 2 | BAJA (conteo manual por filas) | Conteo filas x columnas |
| 27 | 27.jpg | 4 | 2 | BAJA (conteo manual por filas) | Conteo filas x columnas |
| 28 | 28.jpg | 9 | 7 | BAJA (conteo manual por filas) | Conteo filas x columnas |
| 29 | 29.jpg | 17 | 8 | MEDIA (auto + validacion visual) | Validar visual |
| 30 | 30.jpg | 13 | 7 | MEDIA (auto + validacion visual) | Validar visual |
| 31 | 31.jpg | 6 | 0 | BAJA (conteo manual por filas) | Conteo filas x columnas |
| 32 | 32.jpg | 9 | 7 | BAJA (conteo manual por filas) | Conteo filas x columnas |
| 33 | 33.jpg | 48 | 34 | ALTA (auto OK) | Aplicar auto |
| 34 | 34.jpg | 61 | 51 | ALTA (auto OK) | Aplicar auto |
| 35 | 35.jpg | 23 | 5 | ALTA (auto OK) | Aplicar auto |
| 36 | 36.jpg | 26 | 26 | ALTA (auto OK) | Aplicar auto |
| 37 | 37.jpg | 4 | 5 | BAJA (conteo manual por filas) | Conteo filas x columnas |
| 38 | 38.jpg | 3 | 7 | BAJA (conteo manual por filas) | Conteo filas x columnas |
| 39 | 39.jpg | 4 | 5 | BAJA (conteo manual por filas) | Conteo filas x columnas |
| 40 | 40.jpg, 40a.jpg, 40b.jpg | 103 | 51 | ALTA (auto OK) | Aplicar auto |

## Detalle por foto

- 1.jpg (zona 1): auto=21 {'can': 2, 'bottle': 13, 'cardboard box': 3, 'food bag': 3} | coco=11 | ALTA (auto OK)
- 10.jpg (zona 10): auto=28 {'bottle': 22, 'food bag': 6} | coco=17 | ALTA (auto OK)
- 10b.jpg (zona 10): auto=34 {'bottle': 26, 'cardboard box': 6, 'food bag': 2} | coco=17 | ALTA (auto OK)
- 11.jpg (zona 11): auto=17 {'bottle': 4, 'cardboard box': 10, 'jar': 1, 'food bag': 2} | coco=3 | MEDIA (auto + validacion visual)
- 12.jpg (zona 12): auto=46 {'bottle': 24, 'food bag': 20, 'cardboard box': 2} | coco=17 | ALTA (auto OK)
- 12b.jpg (zona 12): auto=16 {'cardboard box': 8, 'bottle': 8} | coco=6 | MEDIA (auto + validacion visual)
- 13.jpg (zona 13): auto=18 {'food bag': 13, 'bottle': 5} | coco=2 | MEDIA (auto + validacion visual)
- 13b.jpg (zona 13): auto=40 {'bottle': 36, 'food bag': 4} | coco=13 | ALTA (auto OK)
- 14.jpg (zona 14): auto=52 {'bottle': 42, 'food bag': 4, 'jar': 2, 'cardboard box': 4} | coco=36 | ALTA (auto OK)
- 14b.jpg (zona 14): auto=31 {'bottle': 27, 'cardboard box': 2, 'food bag': 2} | coco=22 | ALTA (auto OK)
- 15.jpg (zona 15): auto=7 {'bottle': 1, 'cardboard box': 2, 'food bag': 3, 'can': 1} | coco=1 | BAJA (conteo manual por filas)
- 16.jpg (zona 16): auto=17 {'bottle': 9, 'food bag': 2, 'cardboard box': 5, 'can': 1} | coco=7 | MEDIA (auto + validacion visual)
- 17.jpg (zona 17): auto=17 {'food bag': 11, 'cardboard box': 5, 'bottle': 1} | coco=10 | MEDIA (auto + validacion visual)
- 17b.jpg (zona 17): auto=16 {'cardboard box': 7, 'bottle': 3, 'food bag': 6} | coco=13 | MEDIA (auto + validacion visual)
- 18.jpg (zona 18): auto=12 {'cardboard box': 9, 'food bag': 2, 'bottle': 1} | coco=5 | MEDIA (auto + validacion visual)
- 19.jpg (zona 19): auto=20 {'cardboard box': 7, 'bottle': 13} | coco=3 | ALTA (auto OK)
- 1b.jpg (zona 1): auto=3 {'cardboard box': 2, 'food bag': 1} | coco=1 | BAJA (conteo manual por filas)
- 2.jpg (zona 2): auto=5 {'bottle': 5} | coco=6 | BAJA (conteo manual por filas)
- 20.jpg (zona 20): auto=20 {'bottle': 13, 'food bag': 5, 'cardboard box': 2} | coco=11 | ALTA (auto OK)
- 21.jpg (zona 21): auto=4 {'bottle': 1, 'food bag': 1, 'cardboard box': 2} | coco=0 | BAJA (conteo manual por filas)
- 22.jpg (zona 22): auto=14 {'food bag': 13, 'bottle': 1} | coco=0 | MEDIA (auto + validacion visual)
- 23.jpg (zona 23): auto=21 {'food bag': 20, 'bottle': 1} | coco=2 | MEDIA (auto + validacion visual)
- 24.jpg (zona 24): auto=36 {'food bag': 32, 'cardboard box': 1, 'bottle': 3} | coco=0 | MEDIA (auto + validacion visual)
- 25.jpg (zona 25): auto=72 {'bottle': 72} | coco=54 | ALTA (auto OK)
- 25b.jpg (zona 25): auto=36 {'bottle': 35, 'cardboard box': 1} | coco=28 | ALTA (auto OK)
- 26.jpg (zona 26): auto=2 {'bottle': 2} | coco=2 | BAJA (conteo manual por filas)
- 27.jpg (zona 27): auto=4 {'bottle': 3, 'cardboard box': 1} | coco=2 | BAJA (conteo manual por filas)
- 28.jpg (zona 28): auto=9 {'bottle': 5, 'cardboard box': 2, 'can': 1, 'jar': 1} | coco=7 | BAJA (conteo manual por filas)
- 29.jpg (zona 29): auto=17 {'bottle': 14, 'cardboard box': 2, 'food bag': 1} | coco=8 | MEDIA (auto + validacion visual)
- 2b.jpg (zona 2): auto=8 {'cardboard box': 3, 'bottle': 3, 'can': 1, 'food bag': 1} | coco=13 | BAJA (conteo manual por filas)
- 3.jpg (zona 3): auto=5 {'bottle': 1, 'food bag': 4} | coco=3 | BAJA (conteo manual por filas)
- 30.jpg (zona 30): auto=13 {'bottle': 10, 'jar': 1, 'food bag': 2} | coco=7 | MEDIA (auto + validacion visual)
- 31.jpg (zona 31): auto=6 {'food bag': 4, 'bottle': 1, 'cardboard box': 1} | coco=0 | BAJA (conteo manual por filas)
- 32.jpg (zona 32): auto=9 {'bottle': 9} | coco=7 | BAJA (conteo manual por filas)
- 33.jpg (zona 33): auto=48 {'bottle': 47, 'cardboard box': 1} | coco=34 | ALTA (auto OK)
- 34.jpg (zona 34): auto=61 {'bottle': 61} | coco=51 | ALTA (auto OK)
- 35.jpg (zona 35): auto=23 {'bottle': 20, 'cardboard box': 3} | coco=5 | ALTA (auto OK)
- 36.jpg (zona 36): auto=26 {'bottle': 26} | coco=26 | ALTA (auto OK)
- 37.jpg (zona 37): auto=4 {'food bag': 3, 'cardboard box': 1} | coco=5 | BAJA (conteo manual por filas)
- 38.jpg (zona 38): auto=3 {'food bag': 2, 'cardboard box': 1} | coco=7 | BAJA (conteo manual por filas)
- 39.jpg (zona 39): auto=4 {'food bag': 3, 'bottle': 1} | coco=5 | BAJA (conteo manual por filas)
- 3b.jpg (zona 3): auto=6 {'cardboard box': 5, 'food bag': 1} | coco=11 | BAJA (conteo manual por filas)
- 4.jpg (zona 4): auto=33 {'bottle': 24, 'food bag': 9} | coco=32 | ALTA (auto OK)
- 40.jpg (zona 40): auto=43 {'bottle': 40, 'food bag': 3} | coco=21 | ALTA (auto OK)
- 40a.jpg (zona 40): auto=27 {'bottle': 26, 'cardboard box': 1} | coco=16 | ALTA (auto OK)
- 40b.jpg (zona 40): auto=33 {'bottle': 24, 'cardboard box': 3, 'food bag': 5, 'jar': 1} | coco=14 | ALTA (auto OK)
- 4b.jpg (zona 4): auto=52 {'bottle': 52} | coco=54 | ALTA (auto OK)
- 5.jpg (zona 5): auto=9 {'bottle': 5, 'food bag': 4} | coco=5 | BAJA (conteo manual por filas)
- 6.jpg (zona 6): auto=23 {'bottle': 10, 'cardboard box': 3, 'food bag': 10} | coco=8 | MEDIA (auto + validacion visual)
- 6b.jpg (zona 6): auto=8 {'food bag': 7, 'bottle': 1} | coco=6 | BAJA (conteo manual por filas)
- 7.jpg (zona 7): auto=12 {'food bag': 2, 'bottle': 10} | coco=3 | MEDIA (auto + validacion visual)
- 8.jpg (zona 8): auto=6 {'food bag': 2, 'cardboard box': 4} | coco=1 | BAJA (conteo manual por filas)
- 9.jpg (zona 9): auto=11 {'cardboard box': 10, 'food bag': 1} | coco=1 | MEDIA (auto + validacion visual)

## Notas tecnicas
- Licores/vitrinas (zonas 25, 34, 4, 40): deteccion de botellas densa y fiable; puede haber duplicados por reflejo en vidrio (NMS 0.35, conf 0.15).
- Abarrotes a granel (latas/bolsas apiladas sin separacion, ej zona 2): la segmentacion por instancia no aplica; contar por filas x columnas con la foto como evidencia.
- Detalles 1b/40b: objetos muy cercanos o muy pequenos (cajetillas) se subdetectan; usar suma de zona + validacion.
- Endpoints nuevos: POST /api/scanner/scan-auto, POST /api/scanner/zone-session (multifoto, max 10), GET /api/scanner/zones-report.