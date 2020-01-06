import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';


@Component({
  selector: 'app-error-toast',
  templateUrl: './error-toast.component.html',
  styleUrls: ['./error-toast.component.css']
})
export class ErrorToastComponent implements OnInit {

  constructor(private dataService:DataService) { }
  @Input() message;
  isPressed:boolean = false;

  ngOnInit() {
  }

  buttonPressed()
  {
    this.isPressed = true;
    this.dataService.setErrorToastMode(false);
  }

}
