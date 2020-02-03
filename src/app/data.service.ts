import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {  

  /*The data management file. All shared information and communication between components goes through this file*/

  constructor(private http:HttpClient) { }

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
  myKey = "FPAxennT0NYk6p3VtWoSgy80zSRGGPf7";
  
  updateFavoriteListEmitter = new Subject<any>()
  fromFavorites:boolean = false;
  citiesData;
  errorStringEmitter = new Subject<string>();
  locationDecisionEmmiter = new Subject<boolean>();
  imageErrorEmmiter = new Subject<string>();
  
  setErrorString(str:string) {
    this.errorStringEmitter.next(str);
  }  

  linkPressed(link:string)
  {
    this.link.next(link);   /*Which page indicator*/
  }

  getCities()  /*List of all the cities information*/
  {
    this.http.get('http://dataservice.accuweather.com/locations/v1/topcities/150?apikey=' + this.myKey)
    .subscribe(cities => {
      this.citiesData = cities;
       this.citiesEmmiter.next(this.citiesData);
    }, error => {
      /*console.log("1")*/
      this.citiesEmmiter.next("API Error");
      this.locationDecisionEmmiter.next(true);
      this.imageErrorEmmiter.next("../../assets/images/error.png");
    })
   
  }


  getCurrentWeather(key:string)
  {
     this.http.get('http://dataservice.accuweather.com/currentconditions/v1/' + key + '?apikey=' + this.myKey)
    .subscribe(city => {
      this.cityDetailsEmitter.next(city); 
    }, error => {
      /*console.log("2")*/
      this.setErrorString("API Error");
      this.locationDecisionEmmiter.next(true);
      this.imageErrorEmmiter.next("../../assets/images/error.png");
    })
  }

  

  updateFavoriteList()   /*Updates your favorite cities when clicking on the Favorites page (refetch)*/
  {
    for(let i=0 ; i<this.favorites.length ; i++)
    {
      this.getCurrentWeather(this.favorites[i].key)
    }
  }
  
  handlerErrors(cityName:string)
  {
    
    if(cityName === '' || cityName === null || cityName === undefined) {
      return "You did not type any input, please try again.";
    }
    if(this.citiesData.filter(city => city.EnglishName.toUpperCase() === cityName.toUpperCase()).length !== 1) {
      
      return "The input that you send does not exists in the repository.";
    }
    return null;
  }


  getLocationKey()
  {
    if(!this.fromFavorites)  /*Activated once in the first load if the user allows access to his location*/
    {
        const http = this.http;
        const key =this.myKey;
        const currentLocationEmitter = this.currentLocationEmitter;
        const locationDecisionEmmiter = this.locationDecisionEmmiter
        const imageErrorEmmiter = this.imageErrorEmmiter;
        
            function success(position) {
        
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;

          http.get('http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=' + key +'&q=' + latitude + '%2C' + longitude)
            .subscribe(city => {            
              currentLocationEmitter.next(city)
          }, error => {
            /*console.log("3")*/
            currentLocationEmitter.next("API Error");
            locationDecisionEmmiter.next(true);
            imageErrorEmmiter.next("../../assets/images/error.png");
          })
      }

        function error() {
          currentLocationEmitter.next( {Key: 215854, EnglishName: "Tel Aviv"});
      }
      /*In the case of a location permission failure or deny, the information about Tel Aviv is transmitted*/
      if (!navigator.geolocation) {
        currentLocationEmitter.next( {Key: 215854, EnglishName: "Tel Aviv"});
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
    }, error => {
      /*console.log("4")*/
      this.fiveDailyForecasts.next("API Error");
      this.locationDecisionEmmiter.next(true);
      this.imageErrorEmmiter.next("../../assets/images/error.png");
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

  pickImage(dailyForecast)  /*Get a link to the image according to the weather text*/
  {
    let imageLink;
    if(dailyForecast.includes("Snow".toLowerCase()) || dailyForecast.includes("Flurries".toLowerCase())) {
      imageLink = "../../assets/images/snowing.png";
        }
      else if(dailyForecast.includes("Shower".toLowerCase()) || dailyForecast.includes("Rain".toLowerCase())) {
        imageLink = "../../assets/images/rain.png";
      }

      else if(dailyForecast.toLowerCase().includes("Cloud".toLowerCase())) {
        imageLink = "../../assets/images/cloudy.png";
      }

      else if(dailyForecast.toLowerCase().includes("Sunny".toLowerCase()) || dailyForecast.includes("Clear".toLowerCase())) {
          imageLink = "../../assets/images/sunny.png";
      }
       
      else if(dailyForecast.includes("Thunderstorm".toLowerCase())) {
          imageLink = "../../assets/images/thunderstorm.png";
      }
      else if(dailyForecast.toLowerCase().includes("Mist".toLowerCase()) || dailyForecast.toLowerCase().includes
      ("Fog".toLowerCase()) || dailyForecast.toLowerCase().includes("Hazy".toLowerCase())) {
          imageLink = "../../assets/images/mist.png";
      }
      else {
        imageLink = "../../assets/images/default.png";
      } 
      return imageLink; 
  }
}

