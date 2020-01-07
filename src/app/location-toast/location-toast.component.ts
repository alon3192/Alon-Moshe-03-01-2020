import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-toast',
  templateUrl: './location-toast.component.html',
  styleUrls: ['./location-toast.component.css']
})
export class LocationToastComponent implements OnInit {

  constructor() { }

  message = "You have to decide wether you want to allow access to your current location";

  ngOnInit() {
  }

}
