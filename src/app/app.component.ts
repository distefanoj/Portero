import { Component } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Portero';
  items: Observable<any[]>;
  constructor(db:AngularFirestore){
    this.items=db.collection('items').valueChanges();
    
  }
}
