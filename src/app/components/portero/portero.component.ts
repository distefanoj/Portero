import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild, } from '@angular/core';
import { SpeechRecognitionService } from "../../services/speech-recognition.service";
import { SpeechsynthesizerService } from "../../services/speechsynthesizer.service";
import { DialogflowService } from "../../services/dialog-flow.service";
import { Message } from "../../interfaces/message";


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


  constructor(private speechRecognitionService: SpeechRecognitionService,
              private SpeechsynthesizerService: SpeechsynthesizerService,
              private DialogflowService: DialogflowService) {
      this.showSearchButton = true;
      
      this.speechData = "";
      this.speechHistory=[];
      this.conteo=0;

  }


  ngOnInit() {
      console.log("Iniciando Servicios")
  }

  ngOnDestroy() {
      this.speechRecognitionService.DestroySpeechObject();
  }

  speechRecogn(): void {
    
   
      //Primera respuesta al apretar el pulsador
      this.DialogflowService.getResponse("Hola").subscribe(res=>{
        //console.log(res.result.fulfillment.speech);
        this.SpeechsynthesizerService.speak(res.result.fulfillment.speech);
      });

      //Se inicia secuencia de escuchar - responder
      this.speechRecognitionService.record()
          .subscribe(
          //Escuchar
          (value) => {
            
              
              if (value.startsWith('intermedio: ')) {                               
                    value = value.substring(12);
                    this.speechData = ('Interpretando: '+ value);
                    this.speechData = value;    
              }else{
                this.speechData=""; 
                this.mensaje=new Message(value, './assets/images/user.png', new Date(), 'user');
                this.speechHistory.push(this.mensaje);
                this.scrollToBottom()
                this.DialogflowService.getResponse(value).subscribe(res=>{
                    //console.log(res.result);
                    if (res.result.metadata.endConversation) {
                        this.SpeechsynthesizerService.speak(res.result.fulfillment.speech);
                        //console.log("Fin de Conversación: "+res.result.fulfillment.speech);
                        this.mensaje=new Message(res.result.fulfillment.speech, './assets/images/bot.png', new Date(), 'bot');
                        this.speechHistory.push(this.mensaje);
                        this.scrollToBottom()
                        this.end();
                    }else{
                        this.SpeechsynthesizerService.speak(res.result.fulfillment.speech);
                        this.mensaje=new Message(res.result.fulfillment.speech, './assets/images/bot.png', new Date(), 'bot');
                        this.speechHistory.push(this.mensaje);
                        this.scrollToBottom()
                        //console.log(res.result.fulfillment.speech);
                    }
                    
                    
                  });    
                
               
               };
        },
          //error
          (err) => {
              console.log(err);
              
              if (err.error == "no-speech") {
                  this.conteo=this.conteo+1;
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

  comenzar(){
      this.speechRecogn();
      this.showSearchButton = false;
     
  }


  end(){
      console.log("end");
    this.speechRecognitionService.DestroySpeechObject(); 
    this.showSearchButton = true;
    
  }


  ngAfterViewChecked() {        
    this.scrollToBottom();        
} 

scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { console.log(err);}                 
}
 

}