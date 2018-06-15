import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http'
import {AppComponent} from './app.component';
import {NgAudioPlayerModule} from './ng-audio-player/ng-audio-player.module'

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgAudioPlayerModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
