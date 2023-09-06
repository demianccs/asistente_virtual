import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { DatosService } from 'src/app/services/datos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  nombre: string = 'invitado';
  nombre1: string = '';
  mensaje: string = '';
  historial: { usuario: string; respuesta: any }[] = [];
  botones: any = '';
  menuPrimero: any[] = [];
  itemForms: FormGroup;
  loading: boolean = true;
  divoculto: boolean = true;


  @ViewChild('scrollableDiv', { static: true }) scrollableDiv!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private socket: Socket,
    private titleService: Title,
    private location: Location,
    private menuService: DatosService,
    private fb: FormBuilder,
    ) {

      this.itemForms = this.fb.group({
        nombre1: ['', Validators.required]
      })

  }
  // this.route.snapshot.queryParamMap.get('user');

  ngOnInit(): void {

    // this.nombre='usuario';

    this.ObtenerMenuPrimero();

    this.titleService.setTitle('DOC Asistente Virtual Datacom');

    this.borrarHistorial(); // Borra el historial al cargar la página

    // this.nombre = this.route.snapshot.queryParamMap.get('user');

    this.socket.emit('nuevo-usuario', this.nombre);
    this.socket.on('historial-conversacion', (historial: { usuario: string; respuesta: [] }[]) => {
      this.historial = historial;
    });
    this.socket.on('respuesta-usuario', (mensaje: { usuario: string; respuesta: [] }) => {
      this.historial.push(mensaje);
    });

    // Escucha el historial de conversación enviado por el servidor
    this.socket.on('historial-conversacion', (historial: { usuario: string; respuesta: [] }[]) => {
      this.historial = historial;
      if(this.historial[0]['respuesta'].length>0){this.botones='menu';}

      // console.log(this.historial[0]['respuesta'].length)
    });

    // Escucha los nuevos mensajes emitidos por otros usuarios
    this.socket.on('nuevo-mensaje-broadcast', (mensaje: { usuario: string; respuesta: [] }) => {
      this.historial.push(mensaje);
    });

    this.socket.emit('borrar-historial', this.nombre);
    this.historial = [];

  }



  enviarMensaje() {
    this.socket.emit('nuevo-mensaje', { usuario: this.nombre, mensaje: this.mensaje });
    this.historial.push({ usuario: this.nombre, respuesta: this.mensaje });
    this.mensaje = '';
    // console.log(this.historial)
  }

  enviarMensajeBoton(opcion: string, tabla: string){
    if(opcion=='datos') {this.botones='datos'}
    else if(opcion=='planes') {this.botones='planes'}
    else {
      this.botones=''
      this.socket.emit('nuevo-mensaje', { usuario: this.nombre, mensaje: opcion, tabla: tabla });
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

  refreshPage() {
    this.location.go(this.location.path()); // Refresh the current URL
    window.location.reload(); // Reload the page
  }

  ObtenerMenuPrimero(){
    this.menuService.apiObtenerMenuPrimero().subscribe(data => {
      this.menuPrimero = data;
      }, error => {
      console.log(error);
    });
  }

  guardarNombre() {
      this.nombre=this.itemForms.get('nombre1')?.value
  }

  ocultar(){
    if(this.divoculto==true){
      const contenido: any = document.getElementById('contenido');
      contenido.style.display = 'none'
      this.divoculto=false
    }
    else {
      const contenido: any = document.getElementById('contenido');
      contenido.style.display = ''
      this.divoculto=true
    }
  }

}
