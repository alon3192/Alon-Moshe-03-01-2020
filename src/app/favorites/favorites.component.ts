import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  constructor(private dataService:DataService) { }

  favorites = [];

  ngOnInit() {

    this.dataService.linkPressed("favorites");  /* Favorites page indicator */
    this.favorites = this.dataService.favorites;
   
  }

}
