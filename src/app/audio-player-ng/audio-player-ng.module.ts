import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProgressComponent} from './progress/progress.component';
import {PlaylistComponent} from './playlist/playlist.component';
import {GraphicsComponent} from './graphics/graphics.component';
import {ControlsComponent} from './controls/controls.component';
import {PlayerComponent} from './player/player.component';
import { CounterPipe } from './pipes/counter.pipe';
import { NumberPipe } from './pipes/number.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ProgressComponent,
        PlaylistComponent, 
        GraphicsComponent, 
        ControlsComponent, 
        PlayerComponent, CounterPipe, NumberPipe
    ],
    exports: [PlayerComponent]
})
export class AudioPlayerNgModule {
}
 