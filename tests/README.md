# 🧪 Tests E2E - SolicitudQA

Este directorio contiene las pruebas automatizadas end-to-end (E2E) para el proyecto SolicitudQA.

## 📁 Estructura

```
e2e/
└── solicitud.spec.ts      # Pruebas del formulario de solicitud
```

## 🚀 Ejecutar Pruebas

```bash
# Todas las pruebas
npm run e2e

# Con interfaz gráfica
npm run e2e:ui

# Con depuración
npm run e2e:debug

# Con reporte completo
npm run e2e:full
```

## 📊 Reportes

Los reportes se generan en:
- `test-results/informe.html` - Reporte visual
- `test-results/informe.md` - Reporte en Markdown
- `test-results/results.json` - Datos JSON

Ver reporte: `npm run e2e:report`

## ✅ Pruebas Incluidas

- ✓ Carga del formulario
- ✓ Llenado de datos
- ✓ Envío del formulario
- ✓ Mensajes de respuesta
- ✓ Validación de campos
- ✓ Performance
- ✓ Accesibilidad
- ✓ Compatibilidad multi-navegador

Para más información, ver [PLAYWRIGHT_GUIDE.md](../PLAYWRIGHT_GUIDE.md)
