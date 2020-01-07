import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  

  constructor(private http:HttpClient) { 

    
  }

  link = new Subject<string>();
  citiesEmmiter = new Subject<any>()
  cityDetailsEmitter = new Subject<any>()
  currentPotionEmitter = new Subject<any>();
  favorites = [];
  isFavoriteEmmiter = new Subject<boolean>();
  fiveDailyForecasts = new Subject<any>();
  convertEmitter = new Subject<boolean>();
  currentLocationEmitter = new Subject<any>()
  displayToastEmitter  = new Subject<boolean>()
  cMode = true; 
  myKey = "8nE8A8hCmNIRTWqS4ke7mp62s3fDzM0C";
  locationDecision:boolean = false;
  updateFavoriteListEmitter = new Subject<any>()
  

  fromFavorites:boolean = false;
 


 

  citiesData; /*= */
    
  

  linkPressed(link:string)
  {
    this.link.next(link);
  }
  getCities()
  {
    this.http.get('http://dataservice.accuweather.com/locations/v1/topcities/150?apikey=' + this.myKey)
    .subscribe(cities => {
      this.citiesData = cities;
       this.citiesEmmiter.next(this.citiesData);
    })
   
  }
  passKeyToMain(key:string, name:string)
  {
    
    this.getCutrrentWeather(key) 
  }

  getCutrrentWeather(key:string)
  {
     this.http.get('http://dataservice.accuweather.com/currentconditions/v1/' + key + '?apikey=' + this.myKey)
    .subscribe(city => {
      this.cityDetailsEmitter.next(city); 
    })
  }

  

  updateFavoriteList()
  {
    
    for(let i=0 ; i<this.favorites.length ; i++)
    {
      this.getCutrrentWeather(this.favorites[i].key)
    }
  }
  
  handlerErrors(cityName:string)
  {
    
    if(cityName === '' || cityName === null || cityName === undefined) {
      return "You did not type any input, please try again";
    }
    if(this.citiesData.filter(city => city.EnglishName.toUpperCase() === cityName.toUpperCase()).length !== 1) {
      
      return "The input that you send does not exists in the repository";
    }
    return null;
  }


  getLocationKey()
  {
    if(!this.fromFavorites)
    {
        const http = this.http;
        const key =this.myKey;
        const currentLocationEmitter = this.currentLocationEmitter;
        
            function success(position) {
        
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;

          http.get('http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=' + key +'&q=' + latitude + '%2C' + longitude)
            .subscribe(city => {            
              currentLocationEmitter.next(city)
          } )
      }

        function error() {
          currentLocationEmitter.next( {Key: 215854, EnglishName:"Tel Aviv"});
      }
    
      if (!navigator.geolocation) {
        currentLocationEmitter.next( {Key: 215854, EnglishName:"Tel Aviv"});
      } else {
        navigator.geolocation.getCurrentPosition(success, error);
      }

    }  
    
  }


  addToFavoriteList(cityName:string, key:string, temperatureC:string, weatherText:string, imageLink:string)
  {
    this.favorites.push({"cityName" : cityName, "key": key, "temperatureC": temperatureC, "weatherText": weatherText, "imageLink":imageLink});
    this.isFavoriteEmmiter.next(true);   
  }
  removeFromFavoriteList(cityName:string)
  {
    this.favorites = this.favorites.filter(city => city.cityName!==cityName);
    this.isFavoriteEmmiter.next(false); 
  }
  isFavorite(cityName:string)
  {  
    var isFav:boolean;
    isFav = this.favorites.filter(city => city.cityName === cityName).length > 0;
    this.isFavoriteEmmiter.next(isFav);
  }

  getDailyForecasts(key:string)
  {
    this.http.get('http://dataservice.accuweather.com/forecasts/v1/daily/5day/' + key + '?apikey=' + this.myKey)
    .subscribe(city => {
      this.fiveDailyForecasts.next(city);   
    })
  }
  convertDeg(condition:boolean)
  {
    this.cMode = !this.cMode;
    this.convertEmitter.next(!condition);
  }

  setErrorToastMode(mode:boolean)
  {
    this.displayToastEmitter.next(mode);
  }

  pickImage(dailyForecast)
  {
    let imageLink;
    if(dailyForecast.includes("Snow".toLowerCase())) {
      imageLink = "../../assets/images/snowing.png";
        }
      else if(dailyForecast.includes("Shower".toLowerCase()) || dailyForecast.includes("Rain".toLowerCase())) {
        imageLink = "../../assets/images/rain.png";
      }

      else if(dailyForecast.toLowerCase().includes("Mostly Cloudy".toLowerCase()) || dailyForecast.toLowerCase().includes
      ("Cloud".toLowerCase()) || dailyForecast.toLowerCase().includes("Partly Cloudy".toLowerCase()) || dailyForecast.includes("Intermittent clouds".toLowerCase())) {
        imageLink = "../../assets/images/cloudy.png";
      }
      else if(dailyForecast.toLowerCase().includes("Partly Sunny".toLowerCase()) || dailyForecast.toLowerCase().includes
      ("Sunny".toLowerCase())) {
          imageLink = "../../assets/images/sunny.png";
      }
      else if(dailyForecast.includes("Mostly sunny".toLowerCase())) {
        imageLink = "../../assets/images/mostly_sunny.png";
      } 
     
      else if(dailyForecast.includes("Thunderstorm".toLowerCase())) {
          imageLink = "../../assets/images/thunderstorm.png";
      }
      else if(dailyForecast.includes("Clear".toLowerCase())) {
          imageLink = "../../assets/images/clear.png";
      } 
      else if(dailyForecast.toLowerCase().includes("Mist".toLowerCase()) || dailyForecast.toLowerCase().includes
      ("Fog".toLowerCase())) {
          imageLink = "../../assets/images/mist.png";
      }
      else {
        imageLink = "../../assets/images/default.png";
      } 
      return imageLink; 
  }
}

