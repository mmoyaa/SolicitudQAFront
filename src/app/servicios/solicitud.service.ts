import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Solicitud {
  nombreapp: string;
  nombre_desarrollador: string;
  nombre_encargado: string;
  url_del_proyecto: string;
  descripcion: string;
  descripcion_pruebas: string;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private apiUrl = 'http://localhost:3000/api/solicitudes';

  constructor(private http: HttpClient) { }

  crearSolicitud(solicitud: Solicitud): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log('🌐 POST a:', this.apiUrl);
    console.log('📦 Datos:', solicitud);

    return this.http.post<any>(this.apiUrl, solicitud, { headers });
  }

  obtenerSolicitudes(): Observable<Solicitud[]> {
    console.log('🌐 GET desde:', this.apiUrl);
    return this.http.get<Solicitud[]>(this.apiUrl);
  }

  obtenerSolicitudPorId(id: number): Observable<Solicitud> {
    console.log('🌐 GET desde:', `${this.apiUrl}/${id}`);
    return this.http.get<Solicitud>(`${this.apiUrl}/${id}`);
  }

  actualizarSolicitud(id: number, solicitud: Solicitud): Observable<any> {
    console.log('🌐 PUT a:', `${this.apiUrl}/${id}`);
    return this.http.put<any>(`${this.apiUrl}/${id}`, solicitud);
  }

  eliminarSolicitud(id: number): Observable<any> {
    console.log('🌐 DELETE a:', `${this.apiUrl}/${id}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
