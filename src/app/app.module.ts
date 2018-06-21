import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {AudioPlayerNgModule} from './audio-player-ng/audio-player-ng.module'

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AudioPlayerNgModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
