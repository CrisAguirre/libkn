# 🧪 Plan de Testing — La Inmaculada

## Resumen de Módulos (13 total)

| # | Módulo | Ruta | Rol Requerido | Estado |
|---|--------|------|---------------|--------|
| 1 | Login / Auth | `/login` | Público | ⬜ Pendiente |
| 2 | Dashboard | `/dashboard` | Cualquiera | ⬜ Pendiente |
| 3 | Inventario (Productos) | `/inventory` | admin (editar) | ⬜ Pendiente |
| 4 | Punto de Venta (POS) | `/pos` | Cualquiera | ⬜ Pendiente |
| 5 | Arqueo de Caja | `/cash` | Cualquiera | ⬜ Pendiente |
| 6 | Proveedores | `/suppliers` | admin | ⬜ Pendiente |
| 7 | Compras a Proveedores | `/purchases` | admin | ⬜ Pendiente |
| 8 | Gastos Operativos | `/expenses` | admin | ⬜ Pendiente |
| 9 | Reportes | `/reports` | admin | ⬜ Pendiente |
| 10 | Alertas | `/alerts` | admin | ⬜ Pendiente |
| 11 | Finanzas | `/finance` | admin | ⬜ Pendiente |
| 12 | Vitrina / Storefront | `/storefront` | Cualquiera | ⬜ Pendiente |
| 13 | Configuración | `/settings` | admin/cliente | ⬜ Pendiente |

---

## 🔐 1. Login / Autenticación

| Test | Descripción | Resultado |
|------|-------------|-----------|
| 1.1 | Login con admin válido (`admin@lainmaculada.com`) | ⬜ |
| 1.2 | Login con credenciales incorrectas muestra error | ⬜ |
| 1.3 | Entrar como invitado redirige al dashboard | ⬜ |
| 1.4 | Logout cierra sesión y redirige a login | ⬜ |
| 1.5 | Acceder a ruta protegida sin login redirige a login | ⬜ |

---

## 📊 2. Dashboard

| Test | Descripción | Resultado |
|------|-------------|-----------|
| 2.1 | Muestra nombre del usuario logueado | ⬜ |
| 2.2 | Tarjetas KPI cargan (Ventas Hoy, Transacciones, Productos, Alertas) | ⬜ |
| 2.3 | Gráfico de ventas semanales renderiza | ⬜ |
| 2.4 | Lista de Productos Estrella muestra datos o "Sin datos" | ⬜ |

---

## 📦 3. Inventario (Productos)

> **Precondición:** Ejecutar `seedInventario.js` para tener productos cargados

| Test | Descripción | Resultado |
|------|-------------|-----------|
| 3.1 | Lista de productos carga correctamente | ⬜ |
| 3.2 | Filtrar por categoría funciona | ⬜ |
| 3.3 | Buscador por nombre/código funciona | ⬜ |
| 3.4 | Modal "Nuevo Producto" se abre y cierra | ⬜ |
| 3.5 | **Categoría y Proveedor son obligatorios** para crear | ⬜ |
| 3.6 | **Código de barras se genera automáticamente** (CAT+PROV+3dígitos) | ⬜ |
| 3.7 | Crear producto nuevo y verificar que aparece en la lista | ⬜ |
| 3.8 | Modal "Editar Producto" precarga datos correctamente | ⬜ |
| 3.9 | Guardar edición de producto actualiza la lista | ⬜ |
| 3.10 | Ajustar stock (📦) sube/baja correctamente | ⬜ |
| 3.11 | Desactivar producto (🗑️) cambia estado | ⬜ |
| 3.12 | Indicador de margen de ganancia muestra % correcto | ⬜ |
| 3.13 | Paginación funciona cuando hay muchos productos | ⬜ |

---

## 🛒 4. Punto de Venta (POS)

> **Precondición:** Tener productos con stock > 0 y caja abierta

| Test | Descripción | Resultado |
|------|-------------|-----------|
| 4.1 | Categorías se muestran **todas visibles** (flex-wrap) | ⬜ |
| 4.2 | Filtrar productos por categoría funciona | ⬜ |
| 4.3 | Buscador de productos funciona | ⬜ |
| 4.4 | Agregar producto al carrito actualiza cantidad y subtotal | ⬜ |
| 4.5 | Botones +/− de cantidad funcionan correctamente | ⬜ |
| 4.6 | Eliminar producto del carrito (✕) funciona | ⬜ |
| 4.7 | Total del carrito se calcula correctamente | ⬜ |
| 4.8 | Seleccionar método de pago (efectivo/transferencia/mixto) | ⬜ |
| 4.9 | **Cobrar venta** exitosamente con SweetAlert de confirmación | ⬜ |
| 4.10 | Stock del producto se descuenta tras la venta | ⬜ |
| 4.11 | No permite agregar productos con stock = 0 | ⬜ |
| 4.12 | Limpiar carrito (🗑️) vacía todos los items | ⬜ |

---

## 💰 5. Arqueo de Caja

| Test | Descripción | Resultado |
|------|-------------|-----------|
| 5.1 | Estado de caja muestra abierta/cerrada | ⬜ |
| 5.2 | **Abrir caja** con monto inicial funciona | ⬜ |
| 5.3 | Ventas acumuladas se muestran en caja abierta | ⬜ |
| 5.4 | **Cerrar caja** pide monto contado y calcula diferencia | ⬜ |
| 5.5 | Historial de arqueos muestra registros anteriores | ⬜ |

---

## 🏭 6. Proveedores

| Test | Descripción | Resultado |
|------|-------------|-----------|
| 6.1 | Lista de proveedores carga con columnas: Código, Nombre, **Categorías**, NIT, Contacto, Estado | ⬜ |
| 6.2 | Modal "Nuevo Proveedor" se abre correctamente | ⬜ |
| 6.3 | **Código se genera automáticamente** (consecutivo 01, 02, 03...) | ⬜ |
| 6.4 | Nombre y Categorías son **obligatorios** | ⬜ |
| 6.5 | Selección múltiple de categorías funciona (Ctrl+click) | ⬜ |
| 6.6 | Crear proveedor y verificar que aparece en lista con código auto | ⬜ |
| 6.7 | Modal "Editar Proveedor" precarga datos y categorías seleccionadas | ⬜ |
| 6.8 | Guardar edición actualiza datos correctamente | ⬜ |
| 6.9 | Desactivar proveedor (🗑️) cambia estado | ⬜ |
| 6.10 | Buscador de proveedores funciona | ⬜ |
| 6.11 | Toggle "Mostrar inactivos" muestra/oculta desactivados | ⬜ |

---

## 🛍️ 7. Compras a Proveedores

| Test | Descripción | Resultado |
|------|-------------|-----------|
| 7.1 | Lista de compras carga correctamente | ⬜ |
| 7.2 | Filtros por estado y fecha funcionan | ⬜ |
| 7.3 | Modal "Nueva Compra" se abre con formulario correcto | ⬜ |
| 7.4 | Seleccionar proveedor de la lista | ⬜ |
| 7.5 | Agregar/eliminar productos de la compra | ⬜ |
| 7.6 | Total de compra se calcula correctamente | ⬜ |
| 7.7 | Registrar compra exitosamente | ⬜ |
| 7.8 | Ver detalle de compra (👁️) abre modal con info completa | ⬜ |
| 7.9 | Anular compra (❌) revierte stock | ⬜ |

---

## 💸 8. Gastos Operativos

| Test | Descripción | Resultado |
|------|-------------|-----------|
| 8.1 | Lista de gastos carga con KPIs arriba | ⬜ |
| 8.2 | Filtros por categoría y fechas funcionan | ⬜ |
| 8.3 | Modal "Registrar Gasto" se abre | ⬜ |
| 8.4 | Campos obligatorios: Categoría, Descripción, Monto | ⬜ |
| 8.5 | Crear gasto exitosamente | ⬜ |
| 8.6 | Editar gasto existente (✏️) precarga datos | ⬜ |
| 8.7 | Eliminar gasto (🗑️) con confirmación | ⬜ |

---

## 📈 9. Reportes

| Test | Descripción | Resultado |
|------|-------------|-----------|
| 9.1 | Sección carga sin errores | ⬜ |
| 9.2 | Cambiar período (día/semana/mes) actualiza datos | ⬜ |
| 9.3 | Productos estrella (Top 10) muestra listado | ⬜ |
| 9.4 | Ventas por categoría muestra gráfico pie | ⬜ |
| 9.5 | Ventas por método de pago muestra datos | ⬜ |
| 9.6 | Valoración de inventario muestra costo/venta/margen | ⬜ |

---

## 🔔 10. Alertas

| Test | Descripción | Resultado |
|------|-------------|-----------|
| 10.1 | Lista de alertas carga (stock bajo, sin stock) | ⬜ |
| 10.2 | Alertas se generan al bajar stock bajo mínimo | ⬜ |

---

## 💹 11. Finanzas

| Test | Descripción | Resultado |
|------|-------------|-----------|
| 11.1 | Resumen financiero carga (Ingresos, Costos, Margen) | ⬜ |
| 11.2 | P&L mensual muestra datos | ⬜ |

---

## 🏪 12. Vitrina (Storefront)

| Test | Descripción | Resultado |
|------|-------------|-----------|
| 12.1 | Página pública de productos carga | ⬜ |

---

## ⚙️ 13. Configuración

| Test | Descripción | Resultado |
|------|-------------|-----------|
| 13.1 | Nombre de tienda, logo, teléfono editables | ⬜ |
| 13.2 | Guardar cambios actualiza config | ⬜ |

---

## 🔄 Pruebas de Integración Cruzada

| Test | Descripción | Resultado |
|------|-------------|-----------|
| INT-1 | Crear proveedor → aparece en formulario de producto y compras | ⬜ |
| INT-2 | Crear producto → aparece en POS y compras | ⬜ |
| INT-3 | Venta en POS → se refleja en Dashboard (ventas hoy) | ⬜ |
| INT-4 | Venta en POS → descuenta stock en Inventario | ⬜ |
| INT-5 | Stock bajo mínimo → genera Alerta automáticamente | ⬜ |
| INT-6 | Compra a proveedor → sube stock en Inventario | ⬜ |
| INT-7 | Gastos + Ventas → se reflejan en módulo Finanzas | ⬜ |

---

## 📋 Orden de Ejecución Recomendado

1. **Login** → Autenticarse como admin
2. **Proveedores** → Verificar que los ya existentes se ven con categorías y código
3. **Inventario** → Inyectar `seedInventario.js` y verificar productos
4. **POS** → Abrir caja y hacer una venta de prueba
5. **Caja** → Verificar que la venta se acumuló
6. **Reportes** → Verificar que se refleja la venta
7. **Compras** → Registrar una compra de prueba
8. **Gastos** → Registrar un gasto de prueba
9. **Finanzas** → Verificar P&L
10. **Alertas** → Verificar alertas de stock

> [!IMPORTANT]
> **Antes de comenzar:** Asegúrate de que el backend local (`libkn`) esté corriendo en `localhost:4000` y el frontend (`inmaculadastore`) en `localhost:4200`.
