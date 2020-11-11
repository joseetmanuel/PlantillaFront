import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Color} from 'ng2-charts';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styles: []
})
export class AdvertisementComponent implements OnInit {

  
  contratoForm = new FormGroup({
    nombre: new FormControl('', [Validators.required])   
  });


  constructor() {
  }

  ngOnInit() {
  }

}
