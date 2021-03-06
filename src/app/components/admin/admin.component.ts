import { Component, OnInit} from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Usuario } from "../../interfaces/usuario.interface";
import { Habitantes } from '../../interfaces/habitantes';
import { Habitante } from '../../interfaces/habitante';
import { Message } from '../../interfaces/message';
import { Historialconveraciones } from '../../interfaces/historialconveraciones';

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
  test:Boolean=false;

  //Id del usuario logueado. Sirve también para establecer la interfaz de FrontEnd que se muestra 
  userid="0";

  //Variable del tipo usuario con los datos del usuario logueado
  datosusuario: Usuario ={Nombre:"",Apellido:"",Mail:"", uid:""}
 
  //Arreglo con Habitantes 
  habitantes:Habitantes[]

  //Variable del tipo Habitante para actualizar Base
  habitante:Habitante={Nombre:"",Apellido:"",Mail:"", Presente:false, uid:""}

  //Arreglo de conversaciones
  conversaciones:Historialconveraciones[]

  //Arreglo de Mensajes
  mensajes:Message[]
  
  //Formulario de Login
  formulario= {
    mail:"",
    password:""    
  }
 
  //Estado
  estado:any={};
  estadoText:string;

  //Variables de cantidad de habitantes para FrontEnd de incio
  cantHab:number=0;
  cantHabPresentes:number=0;
  porHabPresentes:number;
  mensajesEnviados:number;

  //Constructor
  constructor(public bs:BackendService) {
   
    //Se verifica sesión iniciada
    this.bs.logued().then((id)=>{
      this.userid=id; //Se registra id de usuario
      this.getUsuario(); //Se obtienen datos del usuario logueado
      
    });
    //Se verifica el estado del dispositivo
    this.bs.getEstado().subscribe((estado:any)=>{
      estado.forEach(e=>{
        this.estado={
          state:e.payload.doc.data().state
        }
        if(this.estado.state){
          this.estadoText="Sistema Activo";
        }else{
          this.estadoText="Sistema Inactivo";
        }
      })
    })


  }



//----------------------------------- Funciones----------------------------------------------




    //----------------------------------- Funciones de Sesión------------------------------------


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
        this.bs.logout();//Se cierra sesión
        this.bs.logued().then((id)=>{
          this.userid=id; //Si la sesión se cerró se elimina id de usuario
        })  
        this.datosusuario={Nombre:"",Apellido:"",Mail:"", uid:""};//Se blanquean datos de usuario logueado
      }



    //-------------------------------------------------------------------------------------------

   //----------------------------------- Función para encendido y apagado------------------------   

    enciendeApaga(){
      
      let aux={
        state:!this.estado.state,
      }
      this.bs.updateEstado(aux).then();
    }

    //-------------------------------------------------------------------------------------------

    //----------------------------------- Funciones de Usuario------------------------------------


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
          
          setTimeout(function(){this.success=false},2000);
        }, (error) => {
          this.error=true;
          setTimeout(function(){this.error=false},2000);
        });;
      }


    //-------------------------------------------------------------------------------------------





    //----------------------------------- Funciones de Habitantes------------------------------------



      //Función para actualizar habitante
      updateHabitante(){
        this.bs.updateHabitantes(this.habitante).then(() => {
          this.editUsuario=!this.editUsuario;
          
          setTimeout(function(){this.success=false},2000);
        }, (error) => {
          this.error=true;
          setTimeout(function(){this.error=false},2000);
        });;
        this.habitante={Nombre:"",Apellido:"",Mail:"", Presente:false, uid:""}
      }
      

      //Función para crear un nuevo habitante
      addHabitante(){
      
        this.habitante.Presente=true,
        this.bs.createHabitantes(this.habitante).then(() => {
          

        }, (error) => {
          console.error(error);
        });
        this.clearHabitante();
      }

      //Función para blanquear datos de habitante
      clearHabitante(){
        this.editUsuario=true;
        this.habitante={Nombre:"",Apellido:"",Mail:"", Presente:false, uid:""}
      }

      //Función para borrar habitante
      deleteHabitante(uid){
        this.bs.deleteHabitantes(uid).then(() => {
          
        }, (error) => {
          console.error(error);
        });
      }


      //Función para carga de formulario de edición de habitante
      editaHabitante(id, Nombre, Apellido, Mail, Presente){
      
        this.habitante.uid=id,
        this.habitante.Nombre=Nombre,
        this.habitante.Apellido=Apellido,
        this.habitante.Mail=Mail,
        this.habitante.Presente=Presente
        
      }

      //Función para cambiar el valor Presente de un habitante
      changePresente(uid,Nombre,Apellido,Mail,Presente){
        this.habitante.uid=uid;
        this.habitante.Nombre=Nombre;
        this.habitante.Apellido=Apellido;
        this.habitante.Mail=Mail;
        this.habitante.Presente=Presente;
        this.updateHabitante()
    }
    


    //-------------------------------------------------------------------------------------------



    //----------------------------Funciones de Conversaciones y Mensajes-------------------------
 
      //Función para buscar mensajes de una conversacion
      buscaMensajes(id){
        
        this.bs.getMensaje().subscribe((mensaje)=>{
          this.mensajes=[]
          mensaje.forEach((datosmensaje:any)=>{
            if(datosmensaje.payload.doc.data().uid==id){
              this.mensajes.push(datosmensaje.payload.doc.data())
            }
          })
        })
      }

      //Función para borrar una conversación
      deleteConversacion(uid){
        this.bs.deleteConversacion(uid).then(() => {
        }, (error) => {
          console.error(error);
        });
      }
    //-------------------------------------------------------------------------------------------





//-------------------------------------------------------------------------------------------


//Función para contar la cantidad de usuarios presentes que hay
cuentaPresentes(){
  this.cantHabPresentes=0;
  this.porHabPresentes=0;
  this.habitantes.forEach(e=>{
    if(e.data.Presente){
      this.cantHabPresentes=this.cantHabPresentes+1
    
    }
  this.porHabPresentes=100-((this.cantHabPresentes*100)/this.habitantes.length);
   })
  
}



  //Luego de la construcción del componente se realiza la carga de habitantes y conversaciones
  ngOnInit() {
    
      this.bs.getHabitantes().subscribe((Habitantes) => {

      this.habitantes = [];
      Habitantes.forEach((datosHabitante: any) => {
        this.habitantes.push({
          uid: datosHabitante.payload.doc.id,
          data: datosHabitante.payload.doc.data()
          });         
        });
        this.cantHab=this.habitantes.length;
        this.cuentaPresentes();
      });
 
    this.bs.getConversacion().subscribe((Conversaciones) => {
      this.conversaciones = [];
      this.mensajesEnviados=0;
      Conversaciones.forEach((datosconversacion: any) => {
        if(datosconversacion.payload.doc.data().notificar){
          this.mensajesEnviados=this.mensajesEnviados+1;
          console.log("mensajes enviados= " +this.mensajesEnviados);
        }
        this.conversaciones.push({
          uid: datosconversacion.payload.doc.id,
          data: datosconversacion.payload.doc.data()
        });
      });
    });
    
    
    

}
}