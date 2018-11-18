import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild, } from '@angular/core';
import { SpeechRecognitionService } from "../../services/speech-recognition.service";
import { SpeechsynthesizerService } from "../../services/speechsynthesizer.service";
import { DialogflowService } from "../../services/dialog-flow.service";
import { BackendService } from '../../services/backend.service';
import { Message } from "../../interfaces/message";
import { Conversacion } from "../../interfaces/conversacion";



@Component({
  selector: 'app-portero',
  templateUrl: './portero.component.html',
  styleUrls: ['./portero.component.css']
})
export class PorteroComponent implements OnInit, OnDestroy, AfterViewChecked {
    @ViewChild('chatbot') private myScrollContainer: ElementRef;
  showSearchButton: boolean;
  speechData: string;
  conteo: number;
  speechHistory: Message[];
  mensaje:Message;
  Conversacion:Conversacion;
  idConversacion:string;
  Conversaciones:Conversacion[];

  

  constructor(private speechRecognitionService: SpeechRecognitionService,
              private SpeechsynthesizerService: SpeechsynthesizerService,
              private DialogflowService: DialogflowService, private bs: BackendService) {

      this.showSearchButton = true;
      this.speechData = "";
      this.speechHistory=[];
      this.conteo=0;
      this.mensaje={
        content:"sarasa",
        timestamp: new Date((new Date()).getTime() + 24*60*60*1000),
        avatar: "jpg",
        user: "bot",
        uid:this.idConversacion,
    }
    this.Conversacion={uid:'',timestamp:new Date(), notificar:false};
  }


  ngOnInit() {
  
 
  }

  ngOnDestroy() {
      this.speechRecognitionService.DestroySpeechObject();
  }

  //Función principal de conversación
  speechRecogn(): void {
      //Primera respuesta al apretar el pulsador
      this.DialogflowService.getResponse("Hola").subscribe(res=>{
        console.log(res.result.fulfillment.speech);
        this.SpeechsynthesizerService.speak(res.result.fulfillment.speech);
      });

      //Se inicia secuencia de escuchar - responder
      this.speechRecognitionService.record()
          .subscribe(

          //Escuchar
          (value) => {
            
              //Se interpretan palabras intermedias y se muestran por pantalla
              if (value.startsWith('intermedio: ')) {                               
                    value = value.substring(12);
                    this.speechData = ('Interpretando: '+ value);
                    this.speechData = value;    
              }else{//Se registra el nuevo mensaje
                this.speechData=""; 
                this.mensaje={
                    content:value,
                    avatar: './assets/images/user.png',
                    timestamp: new Date(),
                    user: 'user',
                    uid:this.idConversacion
                };
                
                this.speechHistory.push(this.mensaje);//Se ingresa el mensaje en el arreglo de mensajes
                this.scrollToBottom()//mueve el lector de histórico de mensajes
                this.DialogflowService.getResponse(value).subscribe(res=>{
                    //Fin de conversacion
                    if (res.result.metadata.endConversation) {
                        this.SpeechsynthesizerService.speak(res.result.fulfillment.speech);
                        //console.log("Fin de Conversación: "+res.result.fulfillment.speech);
                        this.mensaje={
                            content:res.result.fulfillment.speech,
                            avatar: './assets/images/bot.png',
                            timestamp: new Date(),
                            user: 'bot',
                            uid:this.idConversacion
                        };
                        //Detecta si la conversación derivó en una notificación
                        if(res.result.fulfillment.source=='notificacion'){
                            this.setNotificado();
                        }
                        this.speechHistory.push(this.mensaje);
                        this.scrollToBottom()
                        this.end();
                    }else{
                        this.SpeechsynthesizerService.speak(res.result.fulfillment.speech);
                        this.mensaje=new Message(res.result.fulfillment.speech, './assets/images/bot.png', new Date(), 'bot', this.idConversacion);
                        this.speechHistory.push(this.mensaje);
                        this.scrollToBottom();                    
                    }
                  });    
               };
        },
        (err) => {//Se detecta ausencia de conversación
            console.log(err);
            if (err.error == "no-speech") {
                this.conteo=this.conteo+1;//Se repite el saludo dos veces antes de terminar la conversación
                if (this.conteo<=2) {
                    console.log("--Reiniciando Servicio--");
                    this.speechRecogn();  
                }else{
                    this.end();
                }
            }
          },
          //completion
          () => {
            this.end();
           });
  }

  //Da inicio a la conversaciòn
  comenzar(){
      this.speechRecogn();
      this.showSearchButton = false;
      this.crearConversacion();
  }

  //Finaliza la conversaciòn
  end(){
    this.speechRecognitionService.DestroySpeechObject(); 
    this.showSearchButton = true;

    //carga mensajes de la conversación en la base de datos
    for (let i = 0; i < this.speechHistory.length; i++) { 
        //Se itera el arreglo de mensajes y se los carga en la base de datos con el uid de la conversación
        this.mensaje={
            content:this.speechHistory[i].content,
            avatar:this.speechHistory[i].avatar,
            timestamp: this.speechHistory[i].timestamp,
            user: this.speechHistory[i].user,
            uid:this.idConversacion
        };
        this.bs.createMensaje(this.mensaje);
        }; 
    this.speechHistory=[];
  }


//Función para la creación de conversaciones    
crearConversacion(){
    //Se inicializa la conversación
    this.Conversacion={
    timestamp:new Date(),
    uid:"",
    notificar:false
    }
    //Se guarda la conversación en la base de datos, luego se le asigna su uid
    this.bs.createConversacion(this.Conversacion).then(data=>{
        this.Conversacion={
            uid: data.id.toString(),
            timestamp:new Date(),
            notificar:false
        }
        this.idConversacion=data.id.toString()
        this.bs.updateConversacion(this.Conversacion).then(
        );
    });
}

//Se actualiza la conversación en caso de haber emitido notificación
setNotificado(){
    this.Conversacion.notificar=true;
    this.bs.updateConversacion(this.Conversacion).then();
}



//Funciones varias
  ngAfterViewChecked() {        
    this.scrollToBottom();        
} 

scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { console.log(err);}                 
}

imprimir(){
    console.log(this.Conversacion);
    }

}