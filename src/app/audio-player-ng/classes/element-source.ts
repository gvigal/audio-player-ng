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

    /**
     * Play the source
     */
    play() {
        this.audio.play();
    }

    /**
     * Stop the source
     */
    pause() {
        this.audio.pause();
    }

    /**
     * Pause the source
     */
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    /**
     * Seek the data
     * @param seconds
     */
    seek(seconds:number) {
        this.audio.currentTime = seconds;
    }

    /**
     * Return the duration of the aduio source in seconds
     */
    getDuration():number {
        return this.audio.duration;
    }

    /**
     * Returns the current playing time in seconds
     */
    getCurrentTime():number {
        return this.audio.currentTime;
    }

    /**
     * Mute / unmute the source
     * @param mute
     */
    setMute(mute:number) {
        this.setVolume(mute);
    }

    /**
     * Load the audio source from the url
     * @param url
     */
    load(url:string) {
        this.audio.src = url;
        this.audio.load();
    }
}
