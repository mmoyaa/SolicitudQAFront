# 🧪 Guía de Pruebas Automatizadas con Playwright

## Descripción

Este proyecto incluye un conjunto completo de pruebas automatizadas end-to-end (E2E) usando **Playwright**. Las pruebas validan la funcionalidad del formulario de solicitud, integración con el backend y compatibilidad cross-browser.

## 📋 Requisitos Previos

- Node.js 16+ instalado
- npm o yarn
- Servidor backend ejecutándose en `http://localhost:3000`
- Servidor frontend ejecutándose en `http://localhost:4200`

## 🚀 Instalación

### 1. Instalar Playwright

```bash
npm install -D @playwright/test
```

### 2. Instalar los navegadores

```bash
npx playwright install
```

Esto descargará Chromium, Firefox y WebKit.

## 📝 Estructura de Pruebas

```
tests/
└── e2e/
    └── solicitud.spec.ts    # Pruebas del formulario de solicitud
```

## 🧪 Ejecutar las Pruebas

### Opción 1: Pruebas en modo headless (sin interfaz gráfica)

```bash
npm run e2e
```

Las pruebas se ejecutarán en todos los navegadores (Chromium, Firefox, WebKit) sin mostrar la interfaz gráfica.

### Opción 2: Pruebas en modo UI (interfaz interactiva)

```bash
npm run e2e:ui
```

Se abrirá una interfaz gráfica donde puedes:
- Ver el progreso de las pruebas en tiempo real
- Ver screenshots de cada paso
- Reejecutar pruebas específicas
- Depurar errores

### Opción 3: Depuración detallada

```bash
npm run e2e:debug
```

Se abrirá el Inspector de Playwright donde puedes:
- Pausar la ejecución
- Ejecutar paso a paso
- Ver el estado del DOM
- Inspeccionar elementos

### Opción 4: Ejecutar pruebas completas con reporte

```bash
npm run e2e:full
```

Esto:
1. Ejecuta todas las pruebas
2. Genera un informe HTML detallado
3. Genera un informe Markdown
4. Abre el informe en el navegador

## 📊 Ver Reportes

### Ver el último reporte

```bash
npm run e2e:report
```

Se abrirá el informe HTML interactivo con:
- Resumen de resultados
- Detalles de cada prueba
- Screenshots de fallos
- Videos (si están habilitados)

### Acceder a los reportes

Los reportes se guardan en `test-results/`:

- `informe.html` - Informe visual detallado
- `informe.md` - Informe en Markdown
- `results.json` - Datos en JSON

## 🧪 Pruebas Incluidas

### 1. **Carga del Formulario**
   - Verifica que el formulario carga correctamente
   - Valida que todos los campos están presentes
   - Verifica el título y el botón de envío

### 2. **Llenado de Datos**
   - Prueba llenar cada campo del formulario
   - Verifica que los datos se guardan correctamente
   - Comprueba la persistencia de valores

### 3. **Envío del Formulario**
   - Verifica que la solicitud POST se envía correctamente
   - Valida que el servidor responde con código 200/201
   - Confirma que los datos llegan al backend

### 4. **Mensajes de Respuesta**
   - Verifica que se muestra un mensaje tras el envío
   - Valida que el mensaje es visible y accesible
   - Comprueba que desaparece después de cierto tiempo

### 5. **Validación de Campos**
   - Verifica que los campos requeridos son obligatorios
   - Comprueba que el formulario no se envía sin datos requeridos
   - Valida el formato de URLs

### 6. **Performance**
   - Mide el tiempo de carga de la página
   - Verifica que es menor a 5 segundos
   - Registra métricas de rendimiento

### 7. **Accesibilidad**
   - Prueba navegación por teclado (Tab)
   - Verifica que los elementos reciben foco
   - Comprueba usabilidad sin ratón

## ⚙️ Configuración

### Archivo: `playwright.config.ts`

Configuración global de Playwright:

```typescript
// Cambiar navegadores a probar
projects: [
  { name: 'chromium', ... },
  { name: 'firefox', ... },
  { name: 'webkit', ... },
]

// Cambiar URL base
use: {
  baseURL: 'http://localhost:4200',
}

// Configurar reportes
reporter: [
  ['html', { outputFolder: 'test-results' }],
  ['json', { outputFile: 'test-results/results.json' }],
]
```

### Ejecutar solo con un navegador

```bash
npx playwright test --project=chromium
```

### Ejecutar solo una suite de pruebas

```bash
npx playwright test solicitud.spec.ts
```

### Ejecutar solo una prueba específica

```bash
npx playwright test -g "Debe cargar el formulario correctamente"
```

## 🔍 Interpretar los Resultados

### Salida de Consola

```
Running 10 tests using 3 workers

✓ tests/e2e/solicitud.spec.ts:12 Debe cargar el formulario correctamente (2.5s)
✓ tests/e2e/solicitud.spec.ts:23 Debe llenar el formulario con datos válidos (1.8s)
✓ tests/e2e/solicitud.spec.ts:34 Debe enviar el formulario con datos válidos (3.2s)
...
=== 10 passed (45.5s) ===
```

### Códigos de Estado

- ✓ **Pasada** - La prueba se completó exitosamente
- ✗ **Fallida** - La prueba encontró un error
- ⊙ **Saltada** - La prueba fue saltada
- ⊘ **Flaky** - La prueba a veces falla, a veces pasa

## 🐛 Solucionar Problemas

### Problema: "Browser not found"

**Solución:** Instala los navegadores

```bash
npx playwright install
```

### Problema: "Timeout waiting for selector"

**Posible causa:** El elemento no se carga en tiempo
**Solución:** Aumenta el timeout en la prueba

```typescript
await page.waitForSelector('form.solicitud-form', { timeout: 10000 });
```

### Problema: "Connection refused"

**Posible causa:** El servidor no está corriendo
**Solución:** Inicia el servidor en otra terminal

```bash
npm start
```

### Problema: Las pruebas son lentas

**Solución:** Ejecuta en paralelo (por defecto está habilitado)

```bash
npx playwright test --workers=4
```

### Problema: Falla en CI/CD

**Solución:** Usa modo headless sin interfaz gráfica

```bash
CI=true npm run e2e
```

## 📈 Integración con CI/CD

### GitHub Actions

Crea `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: test-results/
          retention-days: 30
```

## 💡 Mejores Prácticas

1. **Mantén las pruebas independientes** - No dependan unas de otras
2. **Usa selectores únicos** - Evita selectores frágiles
3. **Espera explícitamente** - No uses hardcoded delays
4. **Prueba en múltiples navegadores** - Valida compatibilidad
5. **Revisa los screenshots** - Detecta problemas visuales
6. **Registra información útil** - Usa `console.log()` para debug

## 📚 Recursos Útiles

- [Documentación oficial de Playwright](https://playwright.dev)
- [Guía de selectores](https://playwright.dev/docs/locators)
- [API de Assertions](https://playwright.dev/docs/test-assertions)
- [Best Practices](https://playwright.dev/docs/best-practices)

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de consola
2. Verifica el directorio `test-results/`
3. Ejecuta en modo debug: `npm run e2e:debug`
4. Consulta la documentación de Playwright

---

**Última actualización:** 2026-04-25  
**Versión de Playwright:** Latest  
**Estado:** ✅ Proyecto completamente funcional
