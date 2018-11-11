import { Injectable } from '@angular/core';
interface IWindow extends Window {
  speechSynthesis: any;
 }
@Injectable({
  providedIn: 'root'
})
export class SpeechsynthesizerService {

  constructor() { }
  speak(text) {

    const utter = new SpeechSynthesisUtterance(text);
    // the list of all available voices
    const voices = speechSynthesis.getVoices();


    for (let i = 0; i < voices.length; ++i) {
        
        if (voices[i].name === "Google español de Estados Unidos") {
            utter.voice = voices[i];
        }
    }

    utter.rate = 0.9;
    utter.pitch = 1;
    speechSynthesis.speak(utter);
}

}


