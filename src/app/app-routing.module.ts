import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { ChatAdminComponent } from './components/chat-admin/chat-admin.component';

const routes: Routes = [
  { path: '', component: ChatComponent},
  { path: 'chat-admin', component: ChatAdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
