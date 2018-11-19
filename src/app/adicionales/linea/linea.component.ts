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


// Variables del gráfico
public lineChartData:Array<any> = [
    {
      data: [],
      label:"Conversaciones"
    }
];
public lineChartLabels:Array<any> = [];
public lineChartOptions:any = {
responsive: true
};
public lineChartColors:Array<any> = [
{ // grey
backgroundColor: '#56bdcde0',
borderColor: '#17a2b8',
pointBackgroundColor: '#17a2b8',
pointBorderColor: '#fff',
pointHoverBackgroundColor: '#fff',
pointHoverBorderColor: '#17a2b8'
}];
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
      this.generaGrafico("dia")
      
    })
  }





//Función para generar gráfico por tipo
generaGrafico(tipo){
  //Se blanquean las variables
  this.lineChartData = [
    {
      data: [],
      label:"Conversaciones"
    }
  ];
  this.lineChartLabels=[];
  //Se calculan los arreglos en función del tipo de gráfico deseado
  if(tipo=="dia"){
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
      if(this.lineChartLabels.includes(fechaaux)){
        let aux=this.lineChartLabels.indexOf(fechaaux);
        this.lineChartData[0].data[aux]=this.lineChartData[0].data[aux]+1
      }else{//Caso contrario se incluye
        this.lineChartLabels.push(fechaaux);
        let aux=this.lineChartLabels.indexOf(fechaaux);
        this.lineChartData[0].data[aux]=1;
      }
    });    
  }
  if(tipo=="mes"){
    this.conversacion.forEach(d => {
      //Variables auxiliares para cálculo de fecha-----------------
      let monthNames = [
        "ENE", "FEB", "MAR",
        "ABR", "MAY", "JUN", "JUL",
        "AGO", "SEP", "OCT",
        "NOV", "DEC"
      ];
      let monthIndex = d.getMonth();
      let year = d.getFullYear();
      let fechaaux =monthNames[monthIndex] + ' ' + year;
      //------------------------------------------------------------
      //Se verifica si la fecha ya fue incluida en el arreglo de fechas
      if(this.lineChartLabels.includes(fechaaux)){
        let aux=this.lineChartLabels.indexOf(fechaaux);
        this.lineChartData[0].data[aux]=this.lineChartData[0].data[aux]+1
      }else{//Caso contrario se incluye
        this.lineChartLabels.push(fechaaux);
        let aux=this.lineChartLabels.indexOf(fechaaux);
        this.lineChartData[0].data[aux]=1;
      }
    });    
  }
  if(tipo=="año"){
    this.conversacion.forEach(d => {
      //Variables auxiliares para cálculo de fecha-----------------
      let year = d.getFullYear();
      let fechaaux =year;
      //------------------------------------------------------------
      //Se verifica si la fecha ya fue incluida en el arreglo de fechas
      if(this.lineChartLabels.includes(fechaaux)){
        let aux=this.lineChartLabels.indexOf(fechaaux);
        this.lineChartData[0].data[aux]=this.lineChartData[0].data[aux]+1
      }else{//Caso contrario se incluye
        this.lineChartLabels.push(fechaaux);
        let aux=this.lineChartLabels.indexOf(fechaaux);
        this.lineChartData[0].data[aux]=1;
      }
    });    
  }
  //Se refresca el gráfico
    setTimeout(() => {
      this.chart.getChartBuilder(this.chart.ctx);
      
  }, 10);
}  

}
