import { environment } from "../environments/environment";

//Módulos de Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from "@angular/router";
import { LocationStrategy, HashLocationStrategy} from '@angular/common';

//Gráficos
import { ChartsModule } from 'ng2-charts';
import { NgxGaugeModule } from 'ngx-gauge';

//Configuración de Locale
import { LOCALE_ID } from '@angular/core';
import localeEsAr from "@angular/common/locales/es-AR";
import {registerLocaleData} from '@angular/common';
registerLocaleData(localeEsAr);

//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AngularFireAuthModule } from '@angular/fire/auth';

//Angular Bootstrap
import { AppBootstrapModule } from "./app-bootstrap/app-bootstrap.module";

//Componentes
import { AppComponent } from './app.component';
import { AdminComponent } from './components/admin/admin.component';
import { PorteroComponent } from "./components/portero/portero.component";

//Servicios
import { SpeechRecognitionService } from "./services/speech-recognition.service";
import { SpeechsynthesizerService } from "./services/speechsynthesizer.service";
import { DialogflowService } from "./services/dialog-flow.service";
import { BackendService } from './services/backend.service';
import { LineaComponent } from './adicionales/linea/linea.component';



@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    PorteroComponent,
    LineaComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: 'portero', component: PorteroComponent },
      { path: 'admin', component: AdminComponent },
      { path: '', component: PorteroComponent }
    ]),
    AppBootstrapModule,
    AngularFireModule.initializeApp(environment.firebase, 'PorteroInteligente'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ChartsModule,
    NgxGaugeModule 
  ],
  providers: [
    BackendService,
    DialogflowService,
    SpeechRecognitionService,
    SpeechsynthesizerService,
    { provide: LOCALE_ID, useValue: 'es-AR' },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
