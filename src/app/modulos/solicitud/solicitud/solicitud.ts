import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SolicitudService } from '../../../servicios/solicitud.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.html',
  styleUrls: ['./solicitud.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class Solicitud {
  solicitudForm: FormGroup;
  cargando = false;
  mensaje = '';
  tipo_mensaje = ''; // 'exito' o 'error'

  constructor(
    private fb: FormBuilder,
    private solicitudService: SolicitudService
  ) {
    this.solicitudForm = this.fb.group({
      nombre: ['', Validators.required],
      proyecto: ['', Validators.required],
      encargado: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
      descripcion: ['', Validators.required],
      datosPruebas: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log('📋 Formulario válido:', this.solicitudForm.valid);
    console.log('📋 Datos del formulario:', this.solicitudForm.value);

    if (this.solicitudForm.valid) {
      this.cargando = true;
      this.mensaje = '';

      // Mapear los datos del formulario al modelo del backend
      const datosFormulario = this.solicitudForm.value;
      const solicitudData = {
        nombreapp: datosFormulario.proyecto,
        nombre_desarrollador: datosFormulario.nombre,
        nombre_encargado: datosFormulario.encargado,
        url_del_proyecto: datosFormulario.url,
        descripcion: datosFormulario.descripcion,
        descripcion_pruebas: datosFormulario.datosPruebas
      };

      console.log('📤 Enviando solicitud:', solicitudData);

      this.solicitudService.crearSolicitud(solicitudData).subscribe({
        next: (respuesta) => {
          this.cargando = false;
          this.tipo_mensaje = 'exito';
          this.mensaje = '✅ ¡Solicitud guardada exitosamente en la base de datos!';
          console.log('✅ Solicitud guardada:', respuesta);
          this.solicitudForm.reset();

          // Limpiar mensaje después de 3 segundos
          setTimeout(() => {
            this.mensaje = '';
          }, 3000);
        },
        error: (error) => {
          this.cargando = false;
          this.tipo_mensaje = 'error';
          console.error('❌ Error completo:', error);

          let mensajeError = 'Error desconocido';

          if (error.error?.error) {
            mensajeError = error.error.error;
          } else if (error.error?.mensaje) {
            mensajeError = error.error.mensaje;
          } else if (error.message) {
            mensajeError = error.message;
          } else if (error.status) {
            mensajeError = `Error HTTP ${error.status}`;
          }

          this.mensaje = `❌ Error al guardar: ${mensajeError}`;

          // Limpiar mensaje después de 5 segundos
          setTimeout(() => {
            this.mensaje = '';
          }, 5000);
        }
      });
    } else {
      this.tipo_mensaje = 'error';
      this.mensaje = '❌ Por favor completa todos los campos correctamente';
      console.warn('⚠️ Formulario inválido');
      setTimeout(() => {
        this.mensaje = '';
      }, 3000);
    }
  }
}
