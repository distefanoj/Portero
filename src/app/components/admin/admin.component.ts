import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BackendService } from '../../services/backend.service';
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Observable } from 'rxjs';
import {NgForm} from '@angular/forms';
import { Usuario } from "../../interfaces/usuario.interface";
import { Habitantes } from '../../interfaces/habitantes';
import { Habitante } from '../../interfaces/habitante';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})



export class AdminComponent implements OnInit {


  //Variables auxiliares para manipulación del FrontEnd
  error:Boolean;
  success:Boolean;
  editUsuario:Boolean=false;
  pagina:string='0';
  

  //Id del usuario logueado. Sirve también para establecer la interfaz de FrontEnd que se muestra 
  userid="0";

  //Variable del tipo usuario con los datos del usuario logueado
  datosusuario: Usuario ={Nombre:"",Apellido:"",Mail:"", uid:""}
 
  //Arreglo con Habitantes 
  habitantes:Habitantes[]

  //Variable del tipo Habitante para actualizar Base
  habitante:Habitante={Nombre:"",Apellido:"",Mail:"", Presente:"", uid:""}


  //Formulario de Login
  formulario= {
    mail:"distefanoj138@gmail.com",
    password:"tomcat14"    
  }
 



  constructor(public afAuth: AngularFireAuth, afs:AngularFirestore, public bs:BackendService, public zone:NgZone) {
   
    //Se verifica sesión iniciada
    this.bs.logued().then((id)=>{
      this.userid=id; //Se registra id de usuario
      this.getUsuario(); //Se obtienen datos del usuario logueado
      
    })  
    
    
  }


  //Función para obtener los datos del usuario logueado y almacenarlos en una variable auxiliar
  public getUsuario(){
    let editSubscribe=this.bs.getDatosUsuario(this.userid).subscribe((usr:any)=>{
      
      this.datosusuario.Nombre=usr.payload.data().Nombre,
      this.datosusuario.Apellido=usr.payload.data().Apellido,
      this.datosusuario.Mail=usr.payload.data().Mail,
      this.datosusuario.uid=usr.payload.data().uid     
      
      editSubscribe.unsubscribe();
      
    })  
  }

  //Función para actualizar los datos de usuario
  updateUsuario(){
    this.bs.updateUsuario(this.datosusuario).then(() => {
      this.editUsuario=!this.editUsuario;
      this.success=true;
      setTimeout(function(){this.success=false},2000);
    }, (error) => {
      this.error=true;
      setTimeout(function(){this.error=false},2000);
    });;
  }

  //Función para carga de formulario de edición de habitante
  editaHabitante(id, Nombre, Apellido, Mail, Presente){
   
    this.habitante.uid=id,
    this.habitante.Nombre=Nombre,
    this.habitante.Apellido=Apellido,
    this.habitante.Mail=Mail,
    this.habitante.Presente=Presente,
    console.log(this.habitante);
  }

  //Función para actualizar habitante
  updateHabitante(){
    this.bs.updateHabitantes(this.habitante).then(() => {
      this.editUsuario=!this.editUsuario;
      this.success=true;
      setTimeout(function(){this.success=false},2000);
    }, (error) => {
      this.error=true;
      setTimeout(function(){this.error=false},2000);
    });;
    this.habitante={Nombre:"",Apellido:"",Mail:"", Presente:"", uid:""}
  }
  

  //Función para crear un nuevo habitante
  addHabitante(){
   
    this.habitante.Presente="Si",
    this.bs.createHabitantes(this.habitante).then(() => {
      console.log('Documento creado exitósamente!');

    }, (error) => {
      console.error(error);
    });
    this.clearHabitante();
  }

  //Función para blanquear datos de habitante
  clearHabitante(){
    this.editUsuario=true;
    this.habitante={Nombre:"",Apellido:"",Mail:"", Presente:"", uid:""}
  }

  //Función para borrar habitante
  deleteHabitante(uid){
    this.bs.deleteHabitantes(uid).then(() => {
      console.log('Documento eliminado!');
    }, (error) => {
      console.error(error);
    });
  }

  //Función de inicio de sesión
  login() {
    this.bs.login(this.formulario.mail,this.formulario.password).then(r=>{
      this.bs.logued().then((id)=>{
        this.userid=id;//Se inicia sesión. En caso correcto se toma el id de usuario
        this.getUsuario();//Se obtienen datos de usuario en variable local
      })
    })   
  }


  //Función de cierre de sesión
  logout() {
    this.afAuth.auth.signOut();//Se cierra sesión
    this.bs.logued().then((id)=>{
      this.userid=id; //Si la sesión se cerró se elimina id de usuario
    })  
    this.datosusuario={Nombre:"",Apellido:"",Mail:"", uid:""};//Se blanquean datos de usuario logueado
  }

  //OnInit de momento no aplica
  ngOnInit() {
    
      this.bs.getHabitantes().subscribe((Habitantes) => {
      this.habitantes = [];
      Habitantes.forEach((datosHabitante: any) => {
        this.habitantes.push({
          uid: datosHabitante.payload.doc.id,
          data: datosHabitante.payload.doc.data()
        });
      });
    });


  
}
}