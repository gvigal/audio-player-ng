import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  
  options:any;
  playlist:any ={};
  
  constructor(private http:HttpClient) {
    this.options = {
            width: 240,
            height: 12,
            oscFillStyle: 'hsl(290, 45%, 49%)',
            oscStrokeStyle: 'hsl(110, 100%, 49%)',
            freqFillStyle: 'hsl(290, 45%, 49%)',
            freqStrokeStyle:'hsl(110, 100%, 49%)',
            playlistPosition: 'bottom'
        };
  let path = "http://localhost:3000/grupos";
    
    this.playlist = this.http.get(`${path}/Led/Coda`)
  }
}
