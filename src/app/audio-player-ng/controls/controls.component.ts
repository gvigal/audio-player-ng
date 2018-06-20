import {
    Component,
    EventEmitter,
    Output,
    ViewChild,
    ElementRef
} from '@angular/core';

import {ActionType} from '../classes/action-types.enum';

/**
 * Buttons section of the player
 */
@Component({
    selector: 'app-controls',
    templateUrl: './controls.component.html',
    styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {

    @Output() actionEmitter:EventEmitter<any>;
    @ViewChild('tooltip') tooltip:ElementRef;

    ActionType:any;

    stateLoop:string;
    statePlay:boolean;
    stateList:boolean;
    stateStop:boolean;
    stateMute:boolean;
    statePause:boolean;
    stateRandom:boolean;
    stateForward:boolean;
    stateBackward:boolean;
    stateChartbar:boolean;
    stateStepForward:boolean;
    stateStepBackward:boolean;
    stateOscilloscope:boolean;

    volumeProgress:number;
    volumeProgressLast:number;
    showVolumeTooltip:boolean;
    volumeTooltipLeft:string;
    volumeTooltipData:number;

    constructor() {

        // binding for template
        this.ActionType = ActionType;

        this.actionEmitter = new EventEmitter();

        this.stateLoop = '';
        this.stateStop = true;
        this.stateMute = false;
        this.statePlay = false;
        this.stateList = false;
        this.statePause = false;
        this.stateRandom = false;
        this.stateForward = false;
        this.stateBackward = false;
        this.stateChartbar = false;
        this.stateOscilloscope = true;
        this.stateStepForward = false;
        this.stateStepBackward = false;
        this.showVolumeTooltip = false;

        this.volumeTooltipLeft = '0';
        this.volumeTooltipData = 0.5;
        this.volumeProgressLast = 0;
        this.volumeProgress = this.volumeTooltipData;
    }

    /**
     * Activate and deactivate the buttons, and emit the action
     * @param type
     */
    action(type:ActionType) {

        switch (type) {

            case ActionType.STEP_BACKWARD:

                this.stateStepBackward = true;
                setTimeout(() => this.stateStepBackward = false, 100);
                this.actionEmitter.emit({type: ActionType.STEP_BACKWARD});
                break;
            case ActionType.STEP_FORWARD:

                this.stateStepForward = true;
                setTimeout(() => this.stateStepForward = false, 100);
                this.actionEmitter.emit({type: ActionType.STEP_FORWARD});
                break;
            case ActionType.LOOP:

                if (this.stateLoop === '') {
                    this.stateLoop = 'disc';
                } else if (this.stateLoop === 'disc') {
                    this.stateLoop = 'song';
                } else {
                    this.stateLoop = '';
                }
                this.actionEmitter.emit({type: ActionType.LOOP, data: this.stateLoop});
                break;
            case ActionType.RANDOM:

                this.stateRandom = !this.stateRandom;
                this.actionEmitter.emit({type: ActionType.RANDOM, data: this.stateRandom});
                break;
            case ActionType.MUTE:

                this.stateMute = !this.stateMute;
                if (this.stateMute) {
                    this.volumeProgressLast = this.volumeProgress;
                    this.volumeProgress = 0;
                } else {
                    this.volumeProgress = this.volumeProgressLast;
                }
                this.actionEmitter.emit({type: ActionType.MUTE, data: this.stateMute});
                break;
            case ActionType.LIST:

                this.stateList = !this.stateList;
                this.actionEmitter.emit({type: ActionType.LIST});
                break;
            case ActionType.PLAY_PAUSE:

                if (this.statePlay) {
                    this.statePause = true;
                    this.statePlay = false;
                } else {
                    this.statePause = false;
                    this.statePlay = true;
                }
                this.stateStop = false;
                this.actionEmitter.emit({type: ActionType.PLAY_PAUSE});
                break;
            case ActionType.STOP:

                this.actionEmitter.emit({type: ActionType.STOP});
                this.statePause = false;
                this.statePlay = false;
                this.stateStop = true;
                break;
            case ActionType.OSCILLOSCOPE:
                this.stateOscilloscope = !this.stateOscilloscope;
                this.stateChartbar = !this.stateChartbar;
                this.actionEmitter.emit({type});
                break;
            case ActionType.CHARTBAR:
                this.stateOscilloscope = !this.stateOscilloscope;
                this.stateChartbar = !this.stateChartbar;
                this.actionEmitter.emit({type});

                break;
        }
    }

    /**
     * Set the progress of the volume bar and emit the progress
     * @param MouseEvent
     */
    actionVolume(event:any) {

        switch (event.type) {
            case 'mousedown':
            case 'mousemove':

                this.volumeTooltipData = Math.max(event.offsetX / event.target.offsetWidth, 0);
                this.volumeTooltipLeft = (event.offsetX - (this.tooltip.nativeElement.clientWidth / 2)) + 'px';

                if (event.buttons == 1) {
                    this.volumeProgress = this.volumeTooltipData;
                    this.actionEmitter.emit({type: ActionType.VOLUME, data: this.volumeProgress});
                }
                break;
            case 'mouseenter':
                this.showVolumeTooltip = true;
                break;
            case 'mouseleave':
                this.showVolumeTooltip = false;

                if (event.buttons == 1) {
                    this.volumeTooltipData = Math.max(event.offsetX / event.target.offsetWidth, 0);
                    this.volumeProgress = this.volumeTooltipData;
                    this.actionEmitter.emit({type: ActionType.VOLUME, data: this.volumeProgress});
                }

                break;
        }
    }

    /**
     * Activate and deactivate the backward button, and emit the action
     * @param MouseEvent
     */
    actionBackward(event:any) {

        let data;
        switch (event.type) {
            case 'mousedown':
                data = 'mousedown';
                this.stateBackward = true;
                break;
            case 'mouseup':
                data = 'mouseup';
                this.stateBackward = false;
                break;
        }
        this.actionEmitter.emit({type: ActionType.BACKWARD, data});
    }

    /**
     * Activate and deactivate the forward button, and emit the action
     * @param MouseEvent
     */
    actionForward(event:any) {

        let data;
        switch (event.type) {
            case 'mousedown':
                data = 'mousedown';
                this.stateForward = true;
                break;
            case 'mouseup':
                data = 'mouseup';
                this.stateForward = false;
                break;
        }
        this.actionEmitter.emit({type: ActionType.FORWARD, data});
    }
}
