import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


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