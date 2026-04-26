import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class Home {
  // No requiere lógica de formulario, solo mensaje de bienvenida y navbar
}
