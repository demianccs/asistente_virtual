import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DatosService {
  // url = 'http://172.25.39.36:3200/asistente/menu';

  url = 'https://api.datacom.com.bo/asistente/menu';

  constructor(private http: HttpClient) { }

  apiObtenerMenuPrimero(): Observable<any> {
    return this.http.get(this.url)
  }


}


