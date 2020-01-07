import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { DailyForecast } from '../dailyForecast.model';
import { ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  cityName:string;
  cities;
  tmpCities
  private subscription:Subscription
  displayResults:boolean = false;
  cityKey=""  /*"215854";   /*The default key = Tel Aviv*/
  cityNameToSend; /*= "Tel Aviv"*/
  dailyForecasts:DailyForecast[] = [];
  locationDecision:boolean = true;
  errorString = null;
  input;
 
  

  constructor(private dataService:DataService, private route:ActivatedRoute) { }

  ngOnInit() {

    
        this.subscription = this.dataService.currentLocationEmitter.subscribe(
          city => {

            this.dataService.locationDecision = true;
            this.cityKey = city.Key;
            this.cityNameToSend = city.EnglishName;
            this.dataService.isFavorite(this.cityNameToSend);
            this.locationDecision = true;
            this.dataService.getCutrrentWeather(this.cityKey);
            this.dataService.getDailyForecasts(this.cityKey); 
          }
        )
    
    
    
    this.subscription = this.dataService.citiesEmmiter.subscribe(
          cities => {
            console.log("dffdsa")
            this.cities = cities;
            this.tmpCities = [...cities];
          }
        )

    
   

    this.subscription = this.dataService.displayToastEmitter.subscribe(
          mode => {
            setTimeout(()=>{    
              this.errorString = null;
            }, 1501);   
          }
        )

    this.subscription = this.dataService.fiveDailyForecasts.subscribe(
          cityDailyForecasts => {
            
            this.dailyForecasts = [];
            
            for(let i=0 ; i<cityDailyForecasts.DailyForecasts.length ; i++)
            {
              this.dailyForecasts.push(new DailyForecast(cityDailyForecasts.DailyForecasts[i].EpochDate,
                                       cityDailyForecasts.DailyForecasts[i].Temperature.Minimum.Value,
                                       cityDailyForecasts.DailyForecasts[i].Temperature.Maximum.Value,
                                       cityDailyForecasts.DailyForecasts[i].Day.IconPhrase))
            }   
          }
        )  
      this.dataService.getCities(); 
      this.locationDecision = this.dataService.locationDecision;

      this.dataService.getLocationKey()
      this.dataService.linkPressed("home");
      

      this.cityNameToSend = this.route.snapshot.queryParams['cityName'];
      this.cityKey = this.route.snapshot.queryParams['key']
      
      if(this.cityNameToSend !== undefined) {
        this.dataService.isFavorite(this.cityNameToSend);
        this.dataService.getCutrrentWeather(this.cityKey);
        
        this.dataService.getDailyForecasts(this.cityKey);
      }

  }


  onChangeCityName()
  {
    
    this.tmpCities = this.cities.filter(city => city.EnglishName.toUpperCase().includes(this.cityName.toUpperCase()));
    
    if(this.cityName === '' || this.tmpCities.length === 0)
    {
      this.displayResults = false;
      document.getElementsByTagName('input')[0].style.background = "rgb(255, 193, 193)";
      
    }
    else {
      this.displayResults = true;
      document.getElementsByTagName('input')[0].style.background = "rgb(255, 255, 208)";
      
      if(this.dataService.handlerErrors(this.cityName) === null)
      {
        document.getElementsByTagName('input')[0].style.background = "rgb(189, 255, 189)";
      }
    }
  }

  cityChosed(cityName:string)
  {
    this.cityName = cityName;
    this.displayResults = false;
    this.tmpCities = this.cities.filter(city => city.EnglishName.toUpperCase().includes(this.cityName.toUpperCase()));
    document.getElementsByTagName('input')[0].style.background = "rgb(189, 255, 189)";
  }

  searchClicked()
  {
    this.errorString = this.dataService.handlerErrors(this.cityName)
    
    if(this.errorString === null) {
      
        this.cityNameToSend = this.cityName;
      
        this.cityKey = this.tmpCities[0].Key;
        this.dataService.getCutrrentWeather(this.cityKey);
        
        this.dataService.isFavorite(this.cityNameToSend);
        this.dataService.getDailyForecasts(this.cityKey);
      
    }
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
