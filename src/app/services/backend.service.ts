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











 
//Función que permite obtener los datos de un usuario según su id
getDatosUsuario(usuario):any{
return this.afs.collection('usuarios').doc(usuario).snapshotChanges();
}


//Actualiza el Usuario
public updateUsuario(data: Usuario) {
  return this.afs.collection('usuarios').doc(data.uid).set(data);
}


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


//Función para cerrar sesión.
logout() {
  this.afAuth.auth.signOut();
}

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


}