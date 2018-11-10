import { environment } from "../environments/environment";

//Módulos de Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AngularFireAuthModule } from '@angular/fire/auth';

//Angular Bootstrap
import { AppBootstrapModule } from "./app-bootstrap/app-bootstrap.module";

//Componentes
import { AppComponent } from './app.component';

import { AdminComponent } from './components/admin/admin.component';

//Servicios

import { BackendService } from './services/backend.service';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppBootstrapModule,
    AngularFireModule.initializeApp(environment.firebase, 'PorteroInteligente'),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [
    BackendService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
