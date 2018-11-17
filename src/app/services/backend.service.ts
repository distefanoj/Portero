import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from "../interfaces/usuario.interface";
import { Habitante } from "../interfaces/habitante";


@Injectable({
  providedIn: 'root'
})
export class BackendService {




userId:string="0";

  constructor(public afAuth: AngularFireAuth, public afs:AngularFirestore) { 

    

  }







//----------------------------------- Funciones de Sesión -----------------------------------


  //Función para iniciar sesión. Retorna comao promesa información de usuario logueado en caso de éxito.
  login = (username,password)=> {
    return new Promise <string>((resolve, reject)=>{
      this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(username, password).then(a=>{
        resolve("logueado")
      })
      .catch(e=>{
        console.log(e);
        reject ("error de logue")
      });
    })
  }


  //Fución que permite determinar si existe una sesión iniciada. Retorna una promsea con el uid del usuario logueado en caso de existir.
  logued = ()=>{
    return new Promise <string>((resolve, reject)=>{
      this.afAuth.authState.subscribe(user=>{
        if(user){
          this.userId= user.uid;
          resolve (this.userId)     
        }   
        else{
          this.userId= "1";
          console.log("Usuario NO Logueado");
          resolve(this.userId)
        }       
      });  
    })
  }


  //Función para cerrar sesión.
  logout() {
    this.afAuth.auth.signOut();
  }


//-------------------------------------------------------------------------------------------




//----------------------------------- Funciones de Usuario ----------------------------------



  //Función que permite obtener los datos de un usuario según su id
  getDatosUsuario(usuario):any{
  return this.afs.collection('usuarios').doc(usuario).snapshotChanges();
  }
  
  
  //Actualiza el Usuario
  public updateUsuario(data: Usuario) {
    return this.afs.collection('usuarios').doc(data.uid).set(data);
  }




//-------------------------------------------------------------------------------------------








//----------------------------------- Funciones de Habitantes--------------------------------

//Obtiene lista de habitantes
public getHabitantes() {
  return this.afs.collection('habitantes').snapshotChanges();
}

//Actualiza un habitantes
public updateHabitantes(data: Habitante) {
  return this.afs.collection('habitantes').doc(data.uid).set(data);
}

//Crea un nuevo habitante
public createHabitantes(data: any) {
  return this.afs.collection('habitantes').add(data);
}

//Borra un habitante
public deleteHabitantes(documentId: string) {
  return this.afs.collection('habitantes').doc(documentId).delete();
}

//-------------------------------------------------------------------------------------------






//----------------------------------- Funciones de Registro de mensajes----------------------

//Obtiene lista de mensajes de una conversación
public getMensaje() {
  return this.afs.collection('mensaje').snapshotChanges();
}

//Crea un nuevo mensaje
public createMensaje(data: any) {
  return this.afs.collection('mensaje').add(data);
}

//Borra un mensaje
public deleteMensaje(documentId: string) {
  return this.afs.collection('mensaje').doc(documentId).delete();
}

//-------------------------------------------------------------------------------------------



//------------------- Funciones de Registro de conversaciones -------------------------------

//Obtiene lista de mensajes de una conversación
public getConversacion() {
  return this.afs.collection('conversaciones').snapshotChanges();
}

//Crea una nueva conversacion
public createConversacion(data: any) {
  return this.afs.collection('conversaciones').add(data);
}

//Actualiza una conversacion
public updateConversacion(data: any) {
  return this.afs.collection('conversaciones').doc(data.uid).set(data);
}

//Borra un mensaje
public deleteConversacion(documentId: string) {
  return this.afs.collection('conversaciones').doc(documentId).delete();
}

//-------------------------------------------------------------------------------------------













}