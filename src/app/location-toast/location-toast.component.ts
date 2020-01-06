import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-toast',
  templateUrl: './location-toast.component.html',
  styleUrls: ['./location-toast.component.css']
})
export class LocationToastComponent implements OnInit {

  constructor() { }

  message = "You have to decide if you want to five access to your current location";

  ngOnInit() {
  }

}
