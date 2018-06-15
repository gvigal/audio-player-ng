import {Component, EventEmitter, Output, Input, ViewChild, ElementRef} from '@angular/core';

/**
 * Progress bar of song section
 */
@Component({
    selector: 'app-progress',
    templateUrl: './progress.component.html',
    styleUrls: ['./progress.component.scss']
})
export class ProgressComponent {

    @Input() duration:any;
    @Output() seek_:EventEmitter<any>;

    @ViewChild('tooltip') tooltip:ElementRef;

    arrowLeft:number;
    tooltipLeft:number;
    tooltipData:number;
    songProgress:number;

    showTooltip:boolean;
    isActiveProgress:boolean;

    constructor() {
        this.arrowLeft = 50;  // %
        this.songProgress = 0;

        this.showTooltip = false;
        this.isActiveProgress = false;
        this.seek_ = new EventEmitter();
    }

    /**
     * Change the song progress. It's called from PlayerComponent
     * @param time The percent of the bar progress
     */
    draw(time:number) {
        this.songProgress = time;
    }

    /**
     * Change the song progress and emit the percent time for seek to PlayerComponent
     * @param event
     */
    seek(event:any) {
        switch (event.type) {
            case 'mousedown':
            case 'mousemove':

                this.tooltipData = event.offsetX / event.target.clientWidth;
                this.tooltipLeft = (event.offsetX - (this.tooltip.nativeElement.clientWidth / 2));

                this.moveTooltipArrow(event);
                if (event.buttons === 1) {
                    this.songProgress = event.offsetX / event.target.clientWidth;
                    this.seek_.emit(this.songProgress);
                    this.isActiveProgress = true;
                } else {
                    this.isActiveProgress = false;
                }
                break;
            case 'mouseenter':

                this.showTooltip = true;
                break;
            case 'mouseleave':

                // check if is active and  if is out of playlist box
                if (event.buttons === 1 && event.offsetY > 0 && event.offsetY < event.target.clientHeight) {
                    this.songProgress = event.offsetX < 0 ? 0 : 1;
                    this.seek_.emit(this.songProgress);
                    this.isActiveProgress = true;
                } else if (event.buttons === 1) {
                    this.isActiveProgress = true;
                } else {
                    this.isActiveProgress = false;

                }
                this.showTooltip = false;
                break;
        }
    }

    /**
     * Move the tooltip arrow to the edges of the box
     * @param event
     */
    private moveTooltipArrow(event:any) {
        let tooltipWidth = this.tooltip.nativeElement.clientWidth;
        let clientWidth = event.target.clientWidth;

        if (this.tooltipLeft < 0) {

            this.arrowLeft = tooltipWidth / 2 + this.tooltipLeft;

            // 5 is the margin-left (-5px)  plus 1px for adjust border radius
            this.arrowLeft = this.arrowLeft < 6 ? 6 : this.arrowLeft;
            this.tooltipLeft = 0;
        } else if ((this.tooltipLeft + tooltipWidth) > clientWidth) {

            this.arrowLeft = tooltipWidth - (clientWidth - event.offsetX);

            // 7 is 1px more than the border-width (6px) plus 1px for adjust border radius
            this.arrowLeft = this.arrowLeft + 8 > tooltipWidth ? tooltipWidth - 8 : this.arrowLeft;
            this.tooltipLeft = clientWidth - tooltipWidth;
        } else {
            this.arrowLeft = tooltipWidth / 2;
        }
    }

}
