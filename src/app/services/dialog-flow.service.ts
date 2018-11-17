import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable, Subject } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch'
import { environment } from '../../environments/environment';

@Injectable()
export class DialogflowService {

  private baseURL: string = "https://api.dialogflow.com/v1/query?v=20150910";
  private token: string = environment.token;

  constructor(private http: Http){}
  
  //Código para Dialogflow
  public getResponse(query: string){
    let data = {
      query : query,
      lang: 'es',
      sessionId: '12345'
    }
    return this.http
      .post(`${this.baseURL}`, data, {headers: this.getHeaders()}).pipe(map(res => {
        //console.log(data);
        //console.log(res.json());
        return res.json()
      }))
      
  }

  public getHeaders(){
    let headers = new Headers();
    headers.append('Authorization', `Bearer ${this.token}`);
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return headers;
  }
}