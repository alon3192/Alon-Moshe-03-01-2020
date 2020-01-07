import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private dataService:DataService) { }
 

  private subscription:Subscription
  options = ['home', 'favorites'];
  favorites;


  ngOnInit() {

    this.subscription = this.dataService.link.subscribe(
      id => {
        document.getElementById(id).style.color = "blue";
        if(id === this.options[0]) {
          document.getElementById(this.options[1]).style.color = "white";
        }
        else {
          document.getElementById(this.options[0]).style.color = "white";
        }
        if(id === "favorites")
        {
          this.dataService.updateFavoriteList(); /*Updates your favorite cities when clicking on the Favorites page (refetch)*/
        }
        else
        {
          this.dataService.fromFavorites = false;
        }
      }
    )
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

 

}
