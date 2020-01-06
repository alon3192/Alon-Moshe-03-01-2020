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

    this.subscription = this.dataService.convertEmitter.subscribe(
      cMode => {
        this.cMode = cMode;    
      }  
    )
    

    this.card = document.getElementById("card1");
    var date = new Date(+(this.dailyForecast.epochDate)*1000);
    this.day = this.days[date.getDay()]

    this.degF = (+this.dailyForecast.maximumDeg + +this.dailyForecast.minimumDeg) /2;
    this.degC = ((this.degF - 32) *5/9).toFixed(1); 
    
    this.imageLink = this.dataService.pickImage(this.dailyForecast.iconPhrase.toLowerCase())

    

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
