import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { query } from '@angular/core/src/render3/query';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  datosusuario:Observable<any[]>;
  userId: string;
  Nombre;
  constructor(public afAuth: AngularFireAuth, afs:AngularFirestore) {
    afAuth.authState.subscribe(user=>{
      if(user) this.userId=user.uid;
    })


    this.datosusuario = afs.collection('usuarios', ref => ref.where('uid', '==', 'gU7faREgeHXnQWZtcdb6glM6IAf1')).valueChanges();
    
  }

  login() {
    
    this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword('distefanoj138@gmail.com','tomcat14');
    
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  ngOnInit() {
  }

}
