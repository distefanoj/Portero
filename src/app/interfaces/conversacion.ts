

export class Conversacion {
    
    timestamp: Date;
    uid: string
    notificar:Boolean=false;
  
    constructor(uid?: string, timestamp?: Date, notificar?:Boolean){
      this.timestamp = timestamp;
      this.uid= uid;
      this.notificar=notificar;
  }
}