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
  backgroundImage:string = "../../assets/images/rain-image.jpg";

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

    
    this.subscription = this.dataService.cityDetailsEmitter.subscribe(
      city => {
        if(typeof(city) === 'string') {
          
        }
        else {
          this.cityObject = city;
          this.temperatureC = city[0].Temperature.Metric.Value;
          this.weatherText = city[0].WeatherText;
          this.imageLink = this.dataService.pickImage(this.weatherText.toLowerCase())
          this.temperatureF = +(this.getFarenheit(this.temperatureC));  /*Convert to Ferenheit*/ 
          this.setBackgroundImage();
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
    if(this.imageLink.includes("snow")) {
      this.backgroundImage = "../../assets/images/snow-image.jpg";
    }
    else if(this.imageLink.includes("rain")) {
      this.backgroundImage = "../../assets/images/rain-image.jpg";
    }
    else if(this.imageLink.includes("cloudy")) {
      this.backgroundImage = "../../assets/images/cloudy-image.jpg";
    }
    else if(this.imageLink.includes("sunny") || this.imageLink.includes("clear")) {
      this.backgroundImage = "../../assets/images/sunny-image.jpg";
    }
    else if(this.imageLink.includes("mostly_sunny")) {
      this.backgroundImage = "../../assets/images/mostly-sunny-image.jpg";
    }
    else if(this.imageLink.includes("thunderstorm")) {
      this.backgroundImage = "../../assets/images/thunderstorm-image.jpg";
    }
    else if(this.imageLink.includes("mist")) {
      this.backgroundImage = "../../assets/images/mist-image.jpg";
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
