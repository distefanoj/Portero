import { Component, OnInit, ViewChild } from '@angular/core';
import { BackendService } from "../../services/backend.service";
import { Conversacion } from "../../interfaces/conversacion";
import { runInThisContext } from 'vm';
import { BaseChartDirective } from "ng2-charts/ng2-charts";

@Component({
  selector: 'app-linea',
  templateUrl: './linea.component.html',
  styleUrls: ['./linea.component.css']
})
export class LineaComponent  {

  @ViewChild(BaseChartDirective)
public chart: BaseChartDirective;
  
  convaux:Conversacion;
  public conversacion:any[]=[];//Fechas de conversaciones totales
  public dates:string[]=[];// Fechas de conversaciones agrupadas
  public conteo:number[]=[];// Cantidad de conversaciones por fecha


// lineChart
public lineChartData:Array<any> = [
    {
      data: [],
      label:"Conversaciones"
    }
];
public lineChartLabels:Array<any> = this.dates;

public lineChartOptions:any = {
responsive: true
};
public lineChartColors:Array<any> = [
{ // grey
backgroundColor: 'rgba(148,159,177,0.2)',
borderColor: 'rgba(148,159,177,1)',
pointBackgroundColor: 'rgba(148,159,177,1)',
pointBorderColor: '#fff',
pointHoverBackgroundColor: '#fff',
pointHoverBorderColor: 'rgba(148,159,177,0.8)'
},
{ // dark grey
backgroundColor: 'rgba(77,83,96,0.2)',
borderColor: 'rgba(77,83,96,1)',
pointBackgroundColor: 'rgba(77,83,96,1)',
pointBorderColor: '#fff',
pointHoverBackgroundColor: '#fff',
pointHoverBorderColor: 'rgba(77,83,96,1)'
},
{ // grey
backgroundColor: 'rgba(148,159,177,0.2)',
borderColor: 'rgba(148,159,177,1)',
pointBackgroundColor: 'rgba(148,159,177,1)',
pointBorderColor: '#fff',
pointHoverBackgroundColor: '#fff',
pointHoverBorderColor: 'rgba(148,159,177,0.8)'
}
];
public lineChartLegend:boolean = true;
public lineChartType:string = 'line';





  constructor(public bs:BackendService, ){
    
    //Carga inicial de arreglo de fechas de mensajes
    bs.getConversacionGrafico().subscribe((conv)=>{
      let fechas:any[]=[];
      conv.forEach((data:any)=>{
        fechas.push(data.payload.doc.data().timestamp.toDate());          
        })
      for (let i=0; i<=fechas.length; i++){
        //console.log(fechas[i]);
      } 
      this.conversacion=fechas;
      this.generaGrafico()
      setTimeout(() => {
        this.chart.getChartBuilder(this.chart.ctx);
    }, 10);
      
      
      })
  }






generaGrafico(){

this.conversacion.forEach(d => {

  //Variables auxiliares para cálculo de fecha-----------------
  let monthNames = [
    "ENE", "FEB", "MAR",
    "ABR", "MAY", "JUN", "JUL",
    "AGO", "SEP", "OCT",
    "NOV", "DEC"
  ];
  let day = d.getDate();
  let monthIndex = d.getMonth();
  let year = d.getFullYear();
  let fechaaux =day + ' ' + monthNames[monthIndex] + ' ' + year;
  //------------------------------------------------------------




  //Se verifica si la fecha ya fue incluida en el arreglo de fechas
  if(this.dates.includes(fechaaux)){
    let aux=this.dates.indexOf(fechaaux);
    
    this.lineChartData[0].data[aux]=this.lineChartData[0].data[aux]+1
  }else{//Caso contrario se incluye
    this.dates.push(fechaaux);
    let aux=this.dates.indexOf(fechaaux);
    this.lineChartData[0].data[aux]=1;
  }


});

console.log("Fechas " + this.dates);
console.log("Conteo " + this.conteo);
console.log(this.lineChartLabels);
console.log(this.lineChartData);




}  

  
 
  public randomize():void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

}
