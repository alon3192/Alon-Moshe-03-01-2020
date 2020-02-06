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
  cityName:string; /*Input*/ 
  cities;
  tmpCities  /*Contains the list of relevant cities in each user's typing*/ 
  private subscription:Subscription
  displayResults:boolean = false;
  cityKey=""  
  cityNameToSend;
  dailyForecasts:DailyForecast[] = [];  /*The relevant data to present the 5 days forcast*/ 
  locationDecision:boolean = true;     /*Responsible for displaying a location premission message*/ 
  errorString = null;
  
 
  constructor(private dataService:DataService, private route:ActivatedRoute) { }

  ngOnInit() {

    
        this.subscription = this.dataService.currentLocationEmitter.subscribe(    /*Current location request*/ 
          city => {
            if(typeof(city) === 'string') {
              this.errorString = city;
              this.locationDecision = true; 
            }
            else {
              this.cityKey = city.Key;
              this.cityNameToSend = city.EnglishName;
              this.dataService.isFavorite(this.cityNameToSend);
              this.locationDecision = true;                                  
              this.dataService.getCurrentWeather(this.cityKey);
              this.dataService.getDailyForecasts(this.cityKey);
            }  
          }
        )
       
      this.subscription = this.dataService.citiesEmmiter.subscribe(  /*Request to the List of all the cities*/
          cities => {
            if(typeof(cities) === 'string') {
              this.errorString = cities;
            }
            else {
              this.cities = cities;
              this.tmpCities = [...cities];
            } 
          }
        )

    this.subscription = this.dataService.displayToastEmitter.subscribe( /*Activated after the pressing the ok button on the input error message*/
          mode => {
            setTimeout(()=>{    
              this.errorString = null;
            }, 1501);   
          }
        )

    this.subscription = this.dataService.fiveDailyForecasts.subscribe(
          cityDailyForecasts => {
            if(typeof(cityDailyForecasts) === 'string') {
              this.errorString = cityDailyForecasts;
            }
            else {
                this.dailyForecasts = [];
              
              for(let i=0 ; i<cityDailyForecasts.DailyForecasts.length ; i++)
              {
                this.dailyForecasts.push(new DailyForecast(cityDailyForecasts.DailyForecasts[i].EpochDate,
                                        cityDailyForecasts.DailyForecasts[i].Temperature.Minimum.Value,
                                        cityDailyForecasts.DailyForecasts[i].Temperature.Maximum.Value,
                                        cityDailyForecasts.DailyForecasts[i].Day.IconPhrase))
              } 
            }    
          }
        )
        this.subscription = this.dataService.errorStringEmitter.subscribe( 
          str => {
            this.errorString = str;
          }
        ) 
        this.subscription = this.dataService.locationDecisionEmmiter.subscribe( 
          decision => {
            this.locationDecision = decision;
          }
        ) 
      this.dataService.getCities(); 
    
      this.dataService.getLocationKey();
      this.dataService.linkPressed("home");   /* Home page indicator*/ 

      this.cityNameToSend = this.route.snapshot.queryParams['cityName'];   /*Data from favorites page*/ 
      this.cityKey = this.route.snapshot.queryParams['key'];                     /* " */ 
      

      if(this.cityNameToSend !== undefined) {   /*Get the data from favorites page and build the home page*/ 
        this.dataService.isFavorite(this.cityNameToSend);
        this.dataService.getCurrentWeather(this.cityKey);
        this.dataService.getDailyForecasts(this.cityKey);
        this.locationDecision = true;
      }

    
      
  }

  onChangeCityName()  /*Activated every input types*/
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
        this.displayResults = false;
      }
    }


  

    
  }

  onSortChange(e) {
    this.cityChosed(e.target.value);
 }

  cityChosed(cityName:string)  /*Activated when the user clicks on the one of the options from the list*/
  {
    this.cityName = cityName;
    this.displayResults = false;
    this.tmpCities = this.cities.filter(city => city.EnglishName.toUpperCase().includes(this.cityName.toUpperCase()));
    document.getElementsByTagName('input')[0].style.background = "rgb(189, 255, 189)";
    this.searchClicked();
  }

  searchClicked() /*Activated when the user presses the search button*/
  {
    this.errorString = this.dataService.handlerErrors(this.cityName)
    if(this.errorString === null) {
        this.cityNameToSend = this.cityName;
        this.cityKey = this.tmpCities[0].Key;
        this.dataService.getCurrentWeather(this.cityKey);
        this.dataService.isFavorite(this.cityNameToSend);
        this.dataService.getDailyForecasts(this.cityKey); 
    } 
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
