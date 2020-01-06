import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-card',
  templateUrl: './favorite-card.component.html',
  styleUrls: ['./favorite-card.component.css']
})
export class FavoriteCardComponent implements OnInit {

  constructor(private dataService:DataService, private router:Router) { }

  @Input() favoriteCity;
  temperatureC;
  weatherText;
  imageLink;
  temperatureF;

  ngOnInit() {

   
    this.dataService.getCutrrentWeather(this.favoriteCity.key);
  }

  moveToTheMain()
  {
    this.dataService.passKeyToMain(this.favoriteCity.key, this.favoriteCity.cityName);
    this.dataService.fromFavorites = true;
    
    
    this.router.navigate([''], {queryParams:{'cityName' : this.favoriteCity.cityName, 'key':this.favoriteCity.key}})

  }

  

}
