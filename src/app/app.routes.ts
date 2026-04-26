import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		loadComponent: () => import('./modulos/home/home').then(m => m.Home)
	},
	{
		path: 'solicitud',
		loadComponent: () => import('./modulos/solicitud/solicitud/solicitud').then(m => m.Solicitud)
	},
	{
		path: '**',
		redirectTo: ''
	}
];
