export class Message {
    user:string;
    content: string;
    timestamp: Date;
    avatar: string;
    uid:string
  
    constructor(content: string, avatar: string, timestamp?: Date, user?:string, uid?:string){
      this.content = content;
      this.timestamp = timestamp;
      this.avatar = avatar;
      this.user=user;
      this.uid=uid;
    }
  }
  