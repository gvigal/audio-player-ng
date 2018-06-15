import {AudioSource} from "./audio-source";

/**
 * Class to wrap the HTMLAudioElement interface
 */
export class ElementSource extends AudioSource {

    source:MediaElementAudioSourceNode;
    audio:HTMLAudioElement;

    constructor() {
        super();
        this.audio = new Audio();
        this.audio.crossOrigin = "anonymous";
        this.audio.preload = "metadata";
        this.source = AudioSource.getContext().createMediaElementSource(this.audio);

        this.audio.onended = () => this.onended_.next("ended");
        this.audio.onloadeddata = () => this.loaded_.next(this.audio.duration);
    }

    get autoplay():boolean {
        return this.audio.autoplay;
    }

    set autoplay(autoplay:boolean) {
        this.audio.autoplay = autoplay;
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    seek(seconds:number) {
        this.audio.currentTime = seconds;
    }

    getDuration():number {
        return this.audio.duration;
    }

    getCurrentTime():number {
        return this.audio.currentTime;
    }

    setMute(mute:boolean) {
        this.audio.muted = mute;
    }

    load(url:string) {
        this.audio.src = url;
        this.audio.load();
    }
}
