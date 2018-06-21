# AudioPlayerNg

Simple audio player for angular 2+

### Usage

#### Install

```
    npm install audio-player-ng --save
```

#### Dependencies

##### fontawesome-free
```
    npm install @fortawsome/fontawesome-free --save
```
in angular.json
```
    "projects": {
        ...,
        "architect": {
            "build": {
                "styles": [
                    "node_modules/@fortawesome/fontawesome-free/css/all.css",
                    ...
                    ],
                ...
```
or in `index.html`
```html
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css"
      integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
```

##### Roboto font

in `index.html`
```html
<link href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700" rel="stylesheet">
```


#### Load module

in `*.module.ts`
```typescript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';

// import the module
import {AudioPlayerNgModule} from 'audio-player-ng'

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AudioPlayerNgModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

#### Use in the template
in `*.component.html`
```html
<app-player [options]="options" [playlist]="playlist"></app-player>
```

#### Configuration

in `*.component.ts`
##### properties
 - options: a OptionsPlayer interface for config the player
 - playlist: a Observable of PlaylistData interface for load the playlist
```
...
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import { OptionsPlayer, PlaylistData } from "audio-player-ng/audio-player-ng/classes/interfaces";

...

export class AppComponent {

  options:OptionsPlayer;
  playlist:Observable<PlaylistData> ={};

  constructor(private http:HttpClient) {
      this.options = {
            graphicsWidth: 300,
            oscFillStyle: 'hsl(290, 45%, 49%)',
            oscStrokeStyle: 'hsl(110, 100%, 49%)'
        };
      let path =  "" // the playlist url

      this.playlist = this.http.get<PlaylistData>(path);
  }
}
```

##### Interfaces

```
/**
 * Options player
 */
export interface OptionsPlayer {

    // width of the player
    width:number;

    // height of the graphics panel, default: 60px
    graphicsHeight?:number;

    // background-color of the oscilloscope panel
    oscFillStyle:string;

    // front color of the oscilloscope panel
    oscStrokeStyle:string;

    // background-color of the chartbar panel, default: "oscFillStyle"
    freqFillStyle?:string;

    // front color of the chartbar panel, default: "oscStrokeStyle"
    freqStrokeStyle?:string;

    // number of the of the bars of the chartbar panel, default: 32
    freqBars?:number;

    // the values of playlist position are the flex-direction values:
    // column-reverse (top), row (right), column (bottom), row-reverse (left);
    // default: column (bottom)
    playlistPosition?:string;

    // load the song duration from metadata, it makes a request for song, default: true
    loadDuration?:boolean;
}


/**
 * Song data
 */
export interface SongData {

    // title of the song
    title:string;

    // url of the song
    url:string;

    // group of the song if available
    group?:string;

    // disc of the song if available
    disc?:string;

    // duration of the song, if it is not available can be loaded from "options.loadDuration = true"
    duration?:number;
}

/**
 * Playlist data
 */
export interface PlaylistData {

    // title of the playlist or disc
    title:string;

    // group of the playlist if it is a disc
    group?:string;

    // the songs, array de SongData objects
    songs:SongData[];
}
```


#### Styling

... in progress

Css classes for styling the audio player, set the properties with `!important`

```
/* ControlsComponent */
.controls-container {
    background:

    // button color
    .nav-control {
        color:
    }

    // volume background color
    .bar-volume {
        background:
    }

    // volume bar color
    .progress-volume {
        background:
    }

    // timer color
    .timer {
        background:
        color:
    }

    // tooltip color
    .tooltip {
    background:
    border-color:
    color:
    }

    // active color
    .active {

    }

}
/* GraphicsComponent */

.oscilloscope {
    background:
    color:

    canvas {
        height:
        width:
    }
}

.frequency {
    background:
    color:

    canvas {
        height:
        width:
    }
}

/* PlayerComponent */


.player-header {
  background:
  color:

  p {
  font-family:
  }
}

.player-container {
    border:

    .active {
        color:
    }

    .progress {
        height:
    }

    .progress-expanded {
        height:
    }

    .playlist-cmp {
        height:
        width:
    }

    .minimize {
        i {
            color:
        }
    }
}

/* PlaylistComponent */

.song-box {
    background:
    color:
}

.selected-song {
    background:
    color:
}

.bar-scroll {
    background:
}


/* ProgressComponent */

.bar-progress {
  background: $background-color-progress;
}

.progress-song {
  background:
}

.progress-tooltip {
    background:
    border-color:
    color:
}
```


### License
See the [LICENSE](LICENSE.txt) file for license rights and limitations (MIT).