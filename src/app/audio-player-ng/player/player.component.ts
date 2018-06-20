import {
    Component,
    OnInit,
    Input,
    ViewChild,
    OnDestroy,
    AfterViewInit
} from '@angular/core';

import {Observable} from "rxjs";

import {GraphicsComponent} from "../graphics/graphics.component";
import {ProgressComponent} from "../progress/progress.component";
import {PlaylistComponent} from "../playlist/playlist.component";

import {AudioSourceFactory} from "../classes/audio-source-factory";
import {AudioSource} from "../classes/audio-source";
import {AudioState} from "../classes/audio-state.enum";
import {PlaylistData, OptionsPlayer} from "../classes/interfaces";
import {ActionType} from '../classes/action-types.enum';
import {ControlsComponent} from "../controls/controls.component";

/**
 * Core component of the player
 * The component accept two Inputs:
 *   - playlist: A Observable with the PlaylistData interface from the server,
 *   - options: A OptionsPlayer object with the options of the player
 */
@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy, AfterViewInit {

    // A Observable with the playlist from the server
    @Input() playlist:Observable<PlaylistData>;
    
    @Input() options:OptionsPlayer;

    @ViewChild(GraphicsComponent) graphicsCmp:GraphicsComponent;
    @ViewChild(ProgressComponent) progressCmp:ProgressComponent;
    @ViewChild(PlaylistComponent) playlistCmp:PlaylistComponent;
    @ViewChild(ControlsComponent) controlsCmp:ControlsComponent;

    // Hold the state of player
    state:AudioState;

    // Audio source object
    source:AudioSource;

    // Selected playlist, original or random
    playlistSelected:PlaylistData;

    // Original playlist
    playlistData:PlaylistData;

    // Ids for requestAnimationFrame and setTimeout
    forwardId:any;
    backwardId:any;
    animationId:any;

    // Loop type
    loop:string;

    // Volume of player
    volume:number;

    // Index of the selected song
    indexSong:number;

    // Progress time of the song
    counterTime:number;

    // Total time of the song
    durationTime:number;

    // Type of the graphics, oscilloscope or bars chart
    graphicsType:string;

    // State of the many elements
    showList:boolean;
    stateMuted:boolean;
    stateRandom:boolean;
    stateMinimize:boolean;
    expandProgress:boolean;
    isToggledCounterTime:boolean;

    // Lamda for control graphics of the player, it is used with requestAnimationFrame
    draw:(timestamp:number) => void;

    constructor() {

        this.state = AudioState.STOPPED;
        this.source = AudioSourceFactory.getSource("element");
        this.source.loaded.subscribe(duration => {
            this.durationTime = duration;
            this.setCounterTime(0);
        });
        this.source.onended.subscribe(() => {
            this.onEndedSong();
        });

        this.loop = '';
        this.volume = 0.5;
        this.indexSong = 0;
        this.graphicsType = 'osc';

        this.showList = false;
        this.stateMuted = false;
        this.stateRandom = false;
        this.stateMinimize = false;
        this.expandProgress = false;
        this.isToggledCounterTime = false;

        this.draw = this.makeDrawCallback();
    }

    /**
     * Dispatch actions from ControlsComponent
     * @param event
     */
    checkAction(event:any) {

        switch (event.type) {

            case ActionType.STEP_BACKWARD:
                this.stepBackward();
                break;
            case ActionType.STEP_FORWARD:
                this.stepForward();
                break;
            case ActionType.LOOP:
                this.loop = event.data;
                break;
            case ActionType.RANDOM:
                this.setRandom(event.data);
                break;
            case ActionType.MUTE:
                this.mute();
                break;
            case ActionType.VOLUME:
                this.volume = event.data;
                this.source.setVolume(event.data);
                break;
            case ActionType.LIST:
                this.showList = !this.showList;
                break;
            case ActionType.BACKWARD:
                this.backward(event);
                break;
            case ActionType.PLAY_PAUSE:
                this.playPause();
                break;
            case ActionType.STOP:
                this.stop();
                break;
            case ActionType.FORWARD:
                this.forward(event);
                break;
            case ActionType.OSCILLOSCOPE:
                if (!this.stateMinimize) {
                    this.graphicsCmp.toggleGraphics();
                }
                this.graphicsType = 'osc';
                break;
            case ActionType.CHARTBAR:
                if (!this.stateMinimize) {
                    this.graphicsCmp.toggleGraphics();
                }
                this.graphicsType = 'bars';
                break;
        }
    }

    /**
     * Back one song
     */
    stepBackward() {

        if (this.indexSong > 0) {
            this.indexSong--;
            this.loadSong(this.indexSong);
            this.playlistCmp && this.playlistCmp.updateActiveSong(this.indexSong);

        } else {
            this.loadSong(this.indexSong);
            this.playlistCmp && this.playlistCmp.updateActiveSong(this.indexSong);
        }
    }

    /**
     * Advance a song
     */
    stepForward() {

        if (this.indexSong < this.playlistSelected.songs.length - 1) {
            this.indexSong++;
            this.loadSong(this.indexSong);
            this.playlistCmp && this.playlistCmp.updateActiveSong(this.indexSong);

        } else {
            this.loadSong(this.indexSong);
            this.playlistCmp.updateActiveSong(this.indexSong);
        }
    }

    /**
     * Back 5s of the song
     */
    actionBackward() {
        let time = (this.source.getCurrentTime() - 5) < 0 ? 0 : this.source.getCurrentTime() - 5;
        this.source.seek(time);
        this.progressCmp.draw(time / this.source.getDuration());
        this.setCounterTime(time);
    }

    /**
     * Dispatcher the backward action
     * @param event
     */
    backward(event:any) {

        if (event.data === 'mousedown') {

            this.actionBackward();

            this.backwardId = setInterval(() => {
                this.actionBackward();
            }, 250);
        } else if (event.data === 'mouseup') {
            clearInterval(this.backwardId);
        }
    }

    /**
     * Advance 5s of the song
     */
    actionForward() {

        let time = (this.source.getCurrentTime() + 5) > this.source.getDuration()
            ? this.source.getDuration() : this.source.getCurrentTime() + 5;

        this.source.seek(time);
        this.progressCmp.draw(time / this.source.getDuration());
        this.setCounterTime(time);
    }
    
    /**
     * Dispatcher the forward action
     * @param event
     */
    forward(event:any) {

        if (event.data === 'mousedown') {

            this.actionForward();

            this.forwardId = setInterval(() => {
                this.actionForward();
            }, 250);

        } else if (event.data === 'mouseup') {
            clearInterval(this.forwardId)
        }
    }

    /**
     * Play or pause the song
     */
    playPause() {

        if (this.state === AudioState.PLAYING) {
            this.source.pause();
            this.state = AudioState.PAUSED;
            cancelAnimationFrame(this.animationId);
        } else {
            this.source.play();
            this.state = AudioState.PLAYING;
            this.animationId = requestAnimationFrame(this.draw);
        }
    }

    /**
     * Stop the song
     */
    stop() {

        this.state = AudioState.STOPPED;
        cancelAnimationFrame(this.animationId);
        this.source.stop();
        this.setCounterTime(0);
        this.progressCmp.draw(0);

        if (!this.stateMinimize) {
            this.graphicsCmp.clear();
        }
    }

    /**
     * Seek the song
     * @param pointRel The percent point of the progress bar
     */
    seek(pointRel:number) {

        //percent time;
        let time = pointRel * this.source.getDuration()

        switch (this.state) {
            case AudioState.PLAYING:

                this.source.seek(time);
                break;
            case AudioState.ENDED:
            case AudioState.PAUSED:
            case AudioState.STOPPED:

                this.state = AudioState.PAUSED;
                this.source.seek(time);
                this.setCounterTime(time);
                break;
            default :
                break;
        }
    }

    /**
     * Mute the player
     */
    mute() {
        this.stateMuted = !this.stateMuted;
        this.source.setMute((this.stateMuted ? 0.0 : this.volume));
    }

    /**
     * Randomize the playlist
     * @param random Boolean for toogle the state
     */
    setRandom(random:boolean) {

        if (random) {
            let listRandom = {
                title: this.playlistData.title,
                group: this.playlistData.group,
                songs: this.playlistData.songs.slice(0)
            };
            listRandom.songs.sort(() => 0.5 - Math.random());
            listRandom.songs.sort(() => 0.5 - Math.random());
            listRandom.songs.sort(() => 0.5 - Math.random());

            this.playlistSelected = listRandom;
        } else {
            this.playlistSelected = this.playlistData;
        }
        this.indexSong = 0;
        this.loadSong(this.indexSong);
    }

    /**
     * Cancel the graphics animation and check if repeat song is active
     */
    onEndedSong() {
        cancelAnimationFrame(this.animationId);

        if (this.indexSong < this.playlistSelected.songs.length - 1) {

            if (this.loop === "song") {
                this.stop();
                this.playPause();
            } else {
                this.loadSong(this.indexSong + 1);
            }
        } else {

            if (this.loop === "disc") {
                this.loadSong(0);
            } else {
                this.state = AudioState.ENDED;
            }
        }
    }

    /**
     * Load the song
     * @param index
     */
    loadSong(index:number) {
        let url = this.playlistSelected.songs[index].url;

        this.indexSong = index;
        this.source.stop();
        this.source.load(url);
        this.state = AudioState.LOADING;
        this.playPause();
        this.playlistCmp && this.playlistCmp.updateActiveSong(this.indexSong);
        this.controlsCmp.stateStop = false;
        this.controlsCmp.statePause = false;
        this.controlsCmp.statePlay = true;
    }

    /**
     * Minimize/Maximize the player
     */
    minimize() {
        // this.graphicsType = this.graphicsCmp.type;
        this.stateMinimize = !this.stateMinimize;
        this.showList = false;
    }

    /**
     * Callback to render the graphic part, it is passed to request animation frame
     */
    makeDrawCallback() {

        let draw = (timestamp:number) => {

            // played percent
            let timeRel = this.source.getCurrentTime() / this.source.getDuration();

            this.progressCmp.draw(timeRel);

            if (!this.stateMinimize) {
                if (this.graphicsCmp.displayOsc) {
                    this.graphicsCmp.drawOscilloscope(this.source.getTimeData());
                } else {
                    this.graphicsCmp.drawFrequency(this.source.getFreqData());
                }
            }

            this.setCounterTime(this.source.getCurrentTime());
            if (this.state === AudioState.PLAYING) {
                this.animationId = requestAnimationFrame(draw);
            } else {
                cancelAnimationFrame(this.animationId);
            }
        };

        return draw;
    }

    /**
     * Recursive callback for load the duration of each track
     *
     * @param audio
     * @param list
     * @param index
     */
    loadDuration(audio:HTMLAudioElement, list:PlaylistData, index:number) {
        if (index < list.songs.length) {
            let song = list.songs[index];
            audio.src = song.url;
            audio.onloadeddata = () => {
                song.duration = audio.duration;
                this.loadDuration(audio, list, index + 1);
            }
        }
    }

    /**
     * Update the time of the counter time
     * Exchange between consumed or remainder time
     * @param time
     */
    setCounterTime(time:number) {
        this.counterTime = this.isToggledCounterTime ? this.durationTime - time : time;
    }

    /**
     * Prevents the collision of mouse events between child components
     */
    resetPointersEvents() {
        this.progressCmp && (this.progressCmp.isActiveProgress = false);
        this.playlistCmp && (this.playlistCmp.isActiveScrollbar = false);
    }

    /**
     * Expand the bar progress of the song
     * @param type
     */
    showProgress(type:string) {
        this.expandProgress = type === 'enter' ? true : false;
    }

    ngOnInit() {
        let defaultOptions = {
            graphicsHeight: 60,
            freqFillStyle: this.options.freqFillStyle || this.options.oscFillStyle,
            freqStrokeStyle: this.options.freqStrokeStyle || this.options.oscStrokeStyle,
            playlistPosition: "column",
            loadDuration: true
        };

        let options = <OptionsPlayer>{...defaultOptions, ...this.options};
        this.options = options;

        this.playlist.subscribe(list => {
            this.playlistData = list;
            this.playlistSelected = list;

            // load the duration of each track
            if (this.options.loadDuration) {
                let audio = new Audio();
                audio.crossOrigin = "anonymous";
                audio.preload = "metadata";
                this.loadDuration(audio, list, 0);
            }
            this.source.load(this.playlistSelected.songs[this.indexSong].url);
        });
    }

    ngOnDestroy() {
        this.stop();
    }

    ngAfterViewInit() {
        // setTimeout(() =>{
        //
        // this.options.playlistHeight = (this.options.playlistPosition === 'right') ?
        //                          this.playerCmp.nativeElement.clientHeight : this.options.playlistHeight || 150;                                                            150;
        // }, 500)
    }
}
