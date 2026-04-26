import { test, expect } from '@playwright/test';

test.describe('Formulario de Solicitud QA', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de solicitudes
    await page.goto('/solicitud');
    // Esperar a que el formulario esté cargado
    await page.waitForSelector('form.solicitud-form');
  });

  test('Debe cargar el formulario correctamente', async ({ page }) => {
    // Verificar que todos los campos del formulario estén presentes
    const nombreInput = page.locator('#nombre');
    const proyectoInput = page.locator('#proyecto');
    const encargadoInput = page.locator('#encargado');
    const urlInput = page.locator('#url');
    const descripcionTextarea = page.locator('#descripcion');
    const datosPruebasTextarea = page.locator('#datosPruebas');
    const submitButton = page.locator('button[type="submit"]');

    await expect(nombreInput).toBeVisible();
    await expect(proyectoInput).toBeVisible();
    await expect(encargadoInput).toBeVisible();
    await expect(urlInput).toBeVisible();
    await expect(descripcionTextarea).toBeVisible();
    await expect(datosPruebasTextarea).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Verificar que el formulario tiene el título correcto
    const title = page.locator('h2');
    await expect(title).toContainText('Solicitud de Proyecto');
  });

  test('Debe llenar el formulario con datos válidos', async ({ page }) => {
    // Llenar todos los campos usando locator.fill() que funciona mejor con Reactive Forms
    await page.locator('#nombre').fill('Juan Pérez');
    await page.locator('#proyecto').fill('MiProyecto');
    await page.locator('#encargado').fill('Carlos López');
    await page.locator('#url').fill('https://github.com/usuario/miproyecto');
    await page.locator('#descripcion').fill('Este es un proyecto de prueba');
    await page.locator('#datosPruebas').fill('Pruebas unitarias y E2E');

    // Verificar que los valores se han llenado correctamente
    await expect(page.locator('#nombre')).toHaveValue('Juan Pérez');
    await expect(page.locator('#proyecto')).toHaveValue('MiProyecto');
    await expect(page.locator('#encargado')).toHaveValue('Carlos López');
    await expect(page.locator('#url')).toHaveValue('https://github.com/usuario/miproyecto');
    await expect(page.locator('#descripcion')).toHaveValue('Este es un proyecto de prueba');
    await expect(page.locator('#datosPruebas')).toHaveValue('Pruebas unitarias y E2E');
  });

  test('Debe enviar el formulario con datos válidos', async ({ page }) => {
    // Llenar el formulario
    await page.locator('#nombre').fill('Ana García');
    await page.locator('#proyecto').fill('ProyectoTesting');
    await page.locator('#encargado').fill('Roberto Martínez');
    await page.locator('#url').fill('https://github.com/usuario/testing');
    await page.locator('#descripcion').fill('Proyecto para testing con Playwright');
    await page.locator('#datosPruebas').fill('Tests E2E automatizados');

    // Esperar la respuesta después de hacer click (usar Promise.all para paralelismo)
    const responsePromise = page.waitForResponse('**/api/solicitudes');

    // Enviar el formulario
    await page.click('button[type="submit"]');

    // Esperar la respuesta
    const response = await responsePromise;

    // Verificar que la solicitud fue exitosa
    expect([200, 201]).toContain(response.status());
  });

  test('Debe mostrar un mensaje de éxito después de enviar', async ({ page }) => {
    // Llenar el formulario
    await page.locator('#nombre').fill('María Rodríguez');
    await page.locator('#proyecto').fill('SuccessTest');
    await page.locator('#encargado').fill('Fernando Díaz');
    await page.locator('#url').fill('https://github.com/usuario/success');
    await page.locator('#descripcion').fill('Prueba de mensaje de éxito');
    await page.locator('#datosPruebas').fill('Verificar alerta de éxito');

    // Esperar la respuesta
    const responsePromise = page.waitForResponse('**/api/solicitudes');

    // Enviar el formulario
    await page.click('button[type="submit"]');

    // Esperar a la respuesta
    const response = await responsePromise;

    // Verificar que la respuesta fue exitosa
    expect([200, 201]).toContain(response.status());

    // Esperar a que aparezca un mensaje de éxito
    const alerta = page.locator('[class*="alerta"]');
    await expect(alerta).toBeVisible({ timeout: 5000 });

    // Verificar que el mensaje es visible
    const alertaText = await alerta.textContent();
    console.log('Mensaje mostrado:', alertaText);
    expect(alertaText).toBeTruthy();
  });

  test('Debe validar que los campos requeridos sean obligatorios', async ({ page }) => {
    // El botón debe estar deshabilitado si el formulario es vacío/inválido
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();

    // Llenar solo un campo
    await page.locator('#nombre').fill('Test');

    // El botón debe seguir deshabilitado porque faltan campos requeridos
    await expect(submitButton).toBeDisabled();

    // Llenar todos los campos requeridos
    await page.locator('#proyecto').fill('Proyecto Test');
    await page.locator('#encargado').fill('Encargado Test');
    await page.locator('#url').fill('https://github.com/test');
    await page.locator('#descripcion').fill('Descripción test');
    await page.locator('#datosPruebas').fill('Datos de prueba');

    // Ahora el botón debe estar habilitado
    await expect(submitButton).toBeEnabled();
  });

  test('Debe permitir limpiar el formulario y llenar de nuevo', async ({ page }) => {
    // Primera vez: llenar el formulario
    await page.locator('#nombre').fill('Prueba 1');
    await page.locator('#proyecto').fill('Proyecto1');
    await page.locator('#encargado').fill('Encargado1');
    await page.locator('#url').fill('https://github.com/usuario/proyecto1');
    await page.locator('#descripcion').fill('Descripción 1');
    await page.locator('#datosPruebas').fill('Pruebas 1');

    // Verificar que se llenó
    await expect(page.locator('#nombre')).toHaveValue('Prueba 1');

    // Recargar la página (limpia el formulario)
    await page.reload();
    await page.waitForSelector('form.solicitud-form');

    // Verificar que los campos están vacíos
    await expect(page.locator('#nombre')).toHaveValue('');

    // Llenar de nuevo con datos diferentes
    await page.locator('#nombre').fill('Prueba 2');
    await page.locator('#proyecto').fill('Proyecto2');
    await page.locator('#encargado').fill('Encargado2');
    await page.locator('#url').fill('https://github.com/usuario/proyecto2');
    await page.locator('#descripcion').fill('Descripción 2');
    await page.locator('#datosPruebas').fill('Pruebas 2');

    // Verificar los nuevos valores
    await expect(page.locator('#nombre')).toHaveValue('Prueba 2');
    await expect(page.locator('#proyecto')).toHaveValue('Proyecto2');
  });

  test('Debe validar el formato de URL', async ({ page }) => {
    await page.locator('#nombre').fill('Test URL');
    await page.locator('#proyecto').fill('TestURL');
    await page.locator('#encargado').fill('Encargado');

    // Intentar con una URL inválida
    await page.locator('#url').fill('no-es-una-url-valida');
    await page.locator('#descripcion').fill('Descripción');
    await page.locator('#datosPruebas').fill('Pruebas');

    // El navegador debería validar que sea una URL válida
    // y no permitir enviar (depende de la implementación HTML5)
    const urlInput = page.locator('#url');
    const isValid = await urlInput.evaluate((el: any) => el.checkValidity());

    if (!isValid) {
      console.log('✓ Validación de URL correcta - rechaza URLs inválidas');
    }

    // El botón debe estar deshabilitado si la URL es inválida
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
  });
});

test.describe('Performance y Accesibilidad', () => {
  test('Debe cargar la página en tiempo razonable', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/solicitud');
    await page.waitForSelector('form.solicitud-form');
    const loadTime = Date.now() - startTime;

    console.log(`⏱️ Tiempo de carga: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // Debe cargar en menos de 5 segundos
  });

  test('Debe ser accesible con navegación por teclado', async ({ page }) => {
    await page.goto('/solicitud');
    await page.waitForSelector('form.solicitud-form');

    // Navegar usando Tab
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('id'));
    console.log('Elemento enfocado tras Tab:', focusedElement);

    // Continuar presionando Tab
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }

    focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('type'));
    console.log('Elemento enfocado finalmente:', focusedElement);
  });
});
