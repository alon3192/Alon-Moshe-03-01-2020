import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-city-detail',
  templateUrl: './city-detail.component.html',
  styleUrls: ['./city-detail.component.css']
})
export class CityDetailComponent implements OnInit, OnDestroy {

  constructor(private dataService:DataService) { }

  private subscription:Subscription
  @Input() key;
  @Input() cityName;
  cityObject;
  temperatureC;
  temperatureF:number;
  public cMode = true;
  weatherText = "";
  isFavoriteText;
  isFavorite;
  toConvert = "Farenheit"
  imageLink;
  backgroundImage:string="";
  card;
  errorMode:boolean = false;

  ngOnInit() {

    this.subscription = this.dataService.isFavoriteEmmiter.subscribe(   /*Indicates whether the page is set as a favorite*/
      isFav => {
        this.isFavorite = isFav;
        
        if(isFav) {
          
          this.isFavoriteText = "Remove From";
        }
        else {
          this.isFavoriteText = "Add To";
        }
      }  
    )

    this.subscription = this.dataService.imageErrorEmmiter.subscribe(  
      img => {
        this.imageLink = img;
        this.errorMode = true;
      }  
    )
    
    this.subscription = this.dataService.cityDetailsEmitter.subscribe(
      city => {
        if(typeof(city) === 'string') { 
        }
        else {
          this.cityObject = city;
          this.temperatureC = city[0].Temperature.Metric.Value;
          this.weatherText = city[0].WeatherText;
          this.imageLink = this.dataService.pickImage(this.weatherText.toLowerCase(), +this.temperatureC);
          this.temperatureF = +(this.getFarenheit(this.temperatureC));  /*Convert to Ferenheit*/ 
          this.setBackgroundImage();
          this.card = document.getElementById("div_flex");
          if(this.card !== null && document.getElementById("responsive_weather_text") !== null && document.getElementById("weather_text") !== null) {
            this.card.classList.add("card_animation");
            document.getElementById("responsive_weather_text").classList.add("card_animation");
            document.getElementById("weather_text").classList.add("card_animation");
          
          setTimeout(()=>{    
            this.card.classList.remove("card_animation");
            document.getElementById("responsive_weather_text").classList.remove("card_animation");
            document.getElementById("weather_text").classList.remove("card_animation");
          }, 1501); 
        }
          
        }   
      }  
    )

    this.subscription = this.dataService.convertEmitter.subscribe(   /*Responsible for displaying degrees in Fahrenheit or Celsius*/
      cMode => {
        this.cMode = cMode;
        if(this.cMode) {
          this.toConvert = "Farenheit";
        } else {
          this.toConvert = "Celsius";
        }     
      }  
    )
    this.dataService.isFavorite(this.cityName);
    
  }

  favoriteButtonClicked()
  {
    if(this.isFavorite)
    {
      this.dataService.removeFromFavoriteList(this.cityName);
    }
    else {

      this.dataService.addToFavoriteList(this.cityName, this.key, this.temperatureC, this.weatherText, this.imageLink);
    }
  }
  convertDeg()  /*Activated by clicking on the Convert button*/ 
  {
    this.dataService.convertDeg(this.cMode);
  }

  getFarenheit(degree:number)
  {
    return (degree*9/5 + 32).toFixed(1);
  }

  getBackground()
  {
    return this.backgroundImage;
  }

 setBackgroundImage() {
    if(this.weatherText.toLowerCase().includes("snow") || this.weatherText.toLowerCase().includes("flurries") || this.weatherText.toLowerCase().includes("Sleet")) {
      this.backgroundImage = "../../assets/images/snow-image.jpg";
    }
    else if(this.weatherText.toLowerCase().includes("rain") || this.weatherText.toLowerCase().includes("shower") || this.weatherText.toLowerCase().includes("drizzle")) {
      this.backgroundImage = "../../assets/images/rain-image.jpg";
    }
    else if(this.weatherText.toLowerCase().includes("cloud") || this.weatherText.toLowerCase().includes("dreary") || this.weatherText.toLowerCase().includes("overcast"))
     {
      this.backgroundImage = "../../assets/images/cloudy-image.jpg";
    }
    else if(this.weatherText.toLowerCase().includes("sun") || this.weatherText.toLowerCase().includes("clear")) {
      this.backgroundImage = "../../assets/images/sunny-image.jpg";
    }
    else if(this.weatherText.toLowerCase().includes("mostly_sunny")) {
      this.backgroundImage = "../../assets/images/mostly-sunny-image.jpg";
    }
    else if(this.weatherText.toLowerCase().includes("thunderstorm")) {
      this.backgroundImage = "../../assets/images/thunderstorm-image.jpg";
    }
    else if(this.weatherText.toLowerCase().includes("mist") || this.weatherText.toLowerCase().includes("haz") || this.weatherText.toLowerCase().includes("fog")) {
      this.backgroundImage = "../../assets/images/mist-image.jpg";
    }
    
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
