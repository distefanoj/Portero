import { Injectable, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as _ from "lodash";

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}


@Injectable({
  providedIn: 'root'
})



export class SpeechRecognitionService {

  
    speechRecognition: any;

    constructor(private zone: NgZone) {
    }

    record(): Observable<string> {

        return Observable.create(observer => {
            const { webkitSpeechRecognition }: IWindow = <IWindow>window;
            this.speechRecognition = new webkitSpeechRecognition();
            //this.speechRecognition = SpeechRecognition;
            this.speechRecognition.continuous = true;
            //this.speechRecognition.interimResults = true;
            this.speechRecognition.lang = 'es-AR';
            this.speechRecognition.maxAlternatives = 1;
            this.speechRecognition.interimResults = true;


            this.speechRecognition.onresult = speech => {
                let term: string = "";
                let termint: string="";

                if (speech.results) {
                    var result = speech.results[speech.resultIndex];
                    var transcript = result[0].transcript;
                    if (result.isFinal) {
                        if (result[0].confidence < 0.3) {
                            console.log("No se entendió");
                        }
                        else {
                            term = _.trim(transcript);
                            //console.log("Se entendió: -> " + term);
                        }
                    }else{
                        term = "intermedio: "+_.trim(transcript);
                        //console.log("Se entendió: -> " + term);
                    }
                }
                this.zone.run(() => {
                    observer.next(term);
                    
                });
            };

            this.speechRecognition.onerror = error => {
                console.log("error");
                observer.error(error);
                this.zone.run(() => {
                    observer.error(error);
                    
                });
              
            };

            this.speechRecognition.onend = () => {
              
                this.zone.run(() => {
                    observer.complete();
                    
                });
              
                
            };

            this.speechRecognition.start();
            console.log("Escuchando");
            
        });
    }

    DestroySpeechObject() {
        if (this.speechRecognition)
            this.speechRecognition.stop();
    }

}