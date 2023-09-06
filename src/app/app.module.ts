import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatAdminComponent } from './components/chat-admin/chat-admin.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HttpClientModule } from '@angular/common/http';

// const config: SocketIoConfig = { url: 'http://172.25.39.36:3200', options: {} };
const config: SocketIoConfig = { url: 'https://api.datacom.com.bo', options: {} };



@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChatAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
