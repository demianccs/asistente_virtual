import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-chat',
  templateUrl: './chat-admin.component.html',
  styleUrls: ['./chat-admin.component.css']
})
export class ChatAdminComponent implements OnInit {

  nombre: any = '';
  mensaje: string = '';
  historial: { usuario: string; respuesta: string }[] = [];
  botones: any = '';

  @ViewChild('scrollableDiv', { static: true }) scrollableDiv!: ElementRef;

  constructor(private route: ActivatedRoute, private socket: Socket) {


  }
  // this.route.snapshot.queryParamMap.get('user');

  ngOnInit(): void {

    this.borrarHistorial(); // Borra el historial al cargar la página

    this.nombre = this.route.snapshot.queryParamMap.get('user');

    this.socket.emit('nuevo-usuario', this.nombre);
    this.socket.on('historial-conversacion', (historial: { usuario: string; respuesta: string }[]) => {
      this.historial = historial;
    });
    this.socket.on('respuesta-usuario', (mensaje: { usuario: string; respuesta: string }) => {
      this.historial.push(mensaje);
    });

    // Escucha el historial de conversación enviado por el servidor
    this.socket.on('historial-conversacion', (historial: { usuario: string; respuesta: string }[]) => {
      this.historial = historial;
    });

    // Escucha los nuevos mensajes emitidos por otros usuarios
    this.socket.on('nuevo-mensaje-broadcast', (mensaje: { usuario: string; respuesta: string }) => {
      this.historial.push(mensaje);
    });

    this.socket.emit('borrar-historial', this.nombre);
    this.historial = [];

  }



  enviarMensaje() {
    this.socket.emit('nuevo-mensaje', { usuario: this.nombre, mensaje: this.mensaje });
    this.historial.push({ usuario: this.nombre, respuesta: this.mensaje });
    this.mensaje = '';
  }

  enviarMensajeBoton(opcion: string){
    if(opcion=='datos') {this.botones='datos'}
    else if(opcion=='planes') {this.botones='planes'}
    else {
      this.botones=''
      this.socket.emit('nuevo-mensaje', { usuario: this.nombre, mensaje: opcion });
      this.historial.push({ usuario: this.nombre, respuesta: opcion });
      this.mensaje = '';
    }
  }

  borrarHistorial() {
    this.socket.emit('borrar-historial', this.nombre);
    this.historial = [];
  }

  ngAfterViewInit() {
    this.mantenerBarraYUltimaLineaArriba();

    // Observar cambios en el contenido del div
    const observer = new MutationObserver(() => {
      this.mantenerBarraYUltimaLineaArriba();
    });

    observer.observe(this.scrollableDiv.nativeElement, { childList: true });
  }

  mantenerBarraYUltimaLineaArriba() {
    const div = this.scrollableDiv.nativeElement;
    const isScrolledToBottom = div.scrollHeight - div.clientHeight <= div.scrollTop + 1;

    if (!isScrolledToBottom) {
      div.scrollTop = div.scrollHeight - div.clientHeight;
    }
  }

}
