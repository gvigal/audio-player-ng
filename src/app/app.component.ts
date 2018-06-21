import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs';

import {OptionsPlayer, PlaylistData} from './audio-player-ng/classes/interfaces'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    options:OptionsPlayer;
    playlist:Observable<PlaylistData>;

    constructor(private http:HttpClient) {
        this.options = {
            width: 300,
            oscFillStyle: 'hsl(290, 45%, 49%)',
            oscStrokeStyle: 'hsl(110, 100%, 49%)',
            playlistPosition: 'row'
        };
        let path = "http://localhost:3000/grupos/Led/Coda";

        this.playlist = this.http.get<PlaylistData>(path);
    }
}
