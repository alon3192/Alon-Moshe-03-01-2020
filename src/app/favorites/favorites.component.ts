import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  constructor(private dataService:DataService) { }

  favirites;

  ngOnInit() {

    this.dataService.linkPressed("favorites");
    this.favirites = this.dataService.favorites;
   
  }

}
