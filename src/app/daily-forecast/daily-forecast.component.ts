import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DailyForecast } from '../dailyForecast.model';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-daily-forecast',
  templateUrl: './daily-forecast.component.html',
  styleUrls: ['./daily-forecast.component.css']
})
export class DailyForecastComponent implements OnInit, OnDestroy {

  constructor(private dataService:DataService) { }

  day;
  degC
  degF;
  cMode;
  imageLink;
  days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  @Input() dailyForecast:DailyForecast
  subscription:Subscription
  card

  ngOnInit() {

    this.cMode = this.dataService.cMode;

    this.subscription = this.dataService.convertEmitter.subscribe(  /*Activated by clicking on the Convert button*/
      cMode => {
        this.cMode = cMode;    
      }  
    )
    
    var date = new Date(+(this.dailyForecast.epochDate)*1000);
    this.day = this.days[date.getDay()]                              /*Find the day of the week*/ 

    
    this.degF = this.getFarenheit(+this.dailyForecast.maximumDeg, +this.dailyForecast.minimumDeg);
    this.degC = this.getCelsius(this.degF);
    this.imageLink = this.dataService.pickImage(this.dailyForecast.iconPhrase.toLowerCase())

  }

  getFarenheit(max:number, min:number)
  {
    return (max + min) / 2;
  }
  getCelsius(degree:number)
  {
    return ((degree - 32) * 5 / 9).toFixed(1); 
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
