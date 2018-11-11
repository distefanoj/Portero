export class Message {
    user:string;
    content: string;
    timestamp: Date;
    avatar: string;
  
    constructor(content: string, avatar: string, timestamp?: Date, user?:string){
      this.content = content;
      this.timestamp = timestamp;
      this.avatar = avatar;
      this.user=user;
    }
  }
  