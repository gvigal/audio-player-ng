import {
    Component,
    OnInit,
    Input,
    Output,
    ViewChild,
    ElementRef,
    EventEmitter,
    AfterViewInit,
    ChangeDetectorRef, OnChanges
} from '@angular/core';
import {PlaylistData, OptionsPlayer} from "../classes/interfaces";

/**
 * Playlist section
 */
@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, OnChanges, AfterViewInit {

    @Input() playlist:PlaylistData;
    @Input() indexSong:number;
    @Output() load_:EventEmitter<number>;

    @ViewChild('box') box:ElementRef;

    activeSong:any;
    scrollbar:number;
    scrollbarBase:number;
    isExpandScrollbar:boolean;
    isActiveScrollbar:boolean;

    // constructor(private cd:ChangeDetectorRef) {
    constructor() {
        this.load_ = new EventEmitter();
        this.isExpandScrollbar = false;
        this.isActiveScrollbar = false;
    }

    ngOnInit() {
        this.activeSong = this.playlist.songs[this.indexSong];
    }

    ngOnChanges() {
        this.activeSong = this.playlist.songs[this.indexSong];
    }

    ngAfterViewInit() {
        let clientHeight = this.box.nativeElement.clientHeight;
        let scrollHeight = this.box.nativeElement.scrollHeight;
        this.scrollbarBase = clientHeight * (clientHeight / scrollHeight );
        this.scrollbar = this.scrollbarBase;
        this.updateActiveSong(this.indexSong);
        // this.cd.detectChanges();
    }

    /**
     * Emit to the player the index of the song to be loaded
     * @param index Index of the song
     */
    load(index:number) {
        this.load_.emit(index);
        this.activeSong = this.playlist.songs[index];
    }


    /**
     * Updates the active song and moves it to the center of the playlist box
     * @param index
     */
    updateActiveSong(index:number) {
        let nativeElement = this.box.nativeElement;
        let elmtHeight = nativeElement.scrollHeight / nativeElement.children.length;
        let scroll = elmtHeight * index;
        this.activeSong = this.playlist.songs[index];


        if (scroll < nativeElement.clientHeight / 2) {

            nativeElement.scrollTop = 0;
            this.scrollbar = this.scrollbarBase;
            return;
        }

        scroll -= nativeElement.clientHeight / 2;
        nativeElement.scrollTop = scroll;
        let coef = nativeElement.clientHeight / (nativeElement.children.length + 1);

        if (this.indexSong < index) {
            this.scrollBar(this.scrollbar + coef);
        } else if (this.indexSong > index) {
            this.scrollBar(this.scrollbar - coef);
        }

        this.indexSong = index;
    }

    /**
     * Do scroll of the playlist
     * @param event
     */
    scroll(event:WheelEvent) {

        switch (event.type) {
            case "click":

                this.scrollBar(event.offsetY);
                break;
            case "mouseleave":
            case "mousemove":

                if (event.buttons === 1) {
                    this.scrollBar(event.offsetY);
                    this.isActiveScrollbar = true;
                } else {
                    this.isActiveScrollbar = false;
                }
                break;
            case "wheel":

                let nativeElement = this.box.nativeElement;
                let deltaY = event.deltaY > 0 ? 50 : -50;           // for normalize firefox and chrome event.deltaY (50px)

                let scroll = deltaY / nativeElement.scrollHeight * nativeElement.clientHeight + this.scrollbar;
                this.scrollbar = this.checkScroll(scroll);
                nativeElement.scrollTop += deltaY;
                break;
        }
    }

    /**
     * Expand the scrollbar
     * @param event
     */
    showScrollbar(event:MouseEvent) {

        // 100 (px) is  the left width threshold
        this.isExpandScrollbar = (this.box.nativeElement.clientWidth - event.offsetX < 100) ? true : false;

        if (this.isActiveScrollbar) {
            this.scrollBar(event.offsetY);
        }

        if (event.buttons !== 1) {
            this.isActiveScrollbar = false;
        }
    }

    /**
     * Scroll the playlist from scrollbar
     *
     * @param event
     */
    private scrollBar(offsetY) {
        let nativeElement = this.box.nativeElement;

        // if the scroll point is less than the initial bar we reset it
        if (offsetY < this.scrollbarBase) {
            nativeElement.scrollTop = 0;
            this.scrollbar = this.scrollbarBase;
            return;
        }

        nativeElement.scrollTop = (offsetY - this.scrollbarBase) * nativeElement.scrollHeight / nativeElement.clientHeight;
        this.scrollbar = this.checkScroll(offsetY);
    }

    /**
     * Check if the scroll of playlist is out of range
     *
     * @param scroll
     * @returns {number}
     */
    private checkScroll(scroll:number) {

        return (scroll > this.box.nativeElement.clientHeight) ? this.box.nativeElement.clientHeight :
            (scroll < this.scrollbarBase) ? this.scrollbarBase : scroll;
    }

    /**
     * Scrolls the hidden track portion to the right when it overflows
     * @param MouseEvent
     */
    scrollSong(event:any) {
        if (event.target.scrollWidth > event.target.clientWidth) {
            let scroll = event.type == 'mouseenter' ? event.target.scrollWidth - event.target.clientWidth : 0;
            event.target.style.transition = `transform ${event.target.scrollWidth / event.target.clientWidth}s .15s ease-in-out`;
            event.target.style.transform = `translateX(-${scroll}px)`;
        }
    }
}
