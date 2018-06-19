import {Observable, Subject} from "rxjs";
declare var webkitAudioContext:any;

export let audioContext:any = {};

// get cross-browser compatiblity AudioContext
try {
    audioContext = new (AudioContext || webkitAudioContext)();
}
catch (e) {
    alert('Web Audio API is not supported in this browser');
}

/**
 * Abstract class to wrap the AudioNode interface
 */
export abstract class AudioSource {

    loaded_:Subject<any>;
    loaded:Observable<any>;

    onended_:Subject<any>;
    onended:Observable<any>;


    source:AudioNode;
    analyser:AnalyserNode;
    gain:GainNode;

    timeData:Uint8Array;
    freqData:Float32Array;

    constructor() {

        this.loaded_ = new Subject();
        this.loaded = this.loaded_.asObservable();

        this.onended_ = new Subject();
        this.onended = this.onended_.asObservable();

        // config audio nodes
        this.analyser = audioContext.createAnalyser();
        this.analyser.minDecibels = -110;
        this.analyser.smoothingTimeConstant = 0.6;
        this.gain = audioContext.createGain();
        this.gain.gain.setValueAtTime(0.5, 0);

        this.timeData = new Uint8Array(this.analyser.frequencyBinCount);
        this.freqData = new Float32Array(this.analyser.frequencyBinCount);
    }
    
    abstract get autoplay():boolean;
    abstract set autoplay(autoplay:boolean);

    abstract play();

    abstract stop();

    abstract pause();

    abstract seek(seconds:number);

    abstract getDuration():number;

    abstract getCurrentTime():number;

    abstract setMute(mute:number);
    
    abstract load(url:string);

    /**
     * Default AudioContext Object
     * @returns {AudioContext}
     */
    static getContext():AudioContext {
        return audioContext;
    }

    /**
     * Connect to default AudioContext
     */
    connectDefault() {
        this.connect(audioContext.destination);
    }

    /**
     * Connect the source -> analyser -> gain -> destination
     * @param destination
     */
    connect(destination:AudioDestinationNode) {
        this.source.connect(this.analyser);
        this.analyser.connect(this.gain);
        this.gain.connect(destination);
    }
    
    disconnect() {
        this.source.disconnect(this.analyser);
    }

    /**
     * Time Domain Data
     * @returns {Uint8Array}
     */
    getTimeData():Uint8Array {
        this.analyser.getByteTimeDomainData(this.timeData)
        return this.timeData;
    }

    /**
     *  Frequency Domain Data
     * @returns {Float32Array}
     */
    getFreqData():Float32Array {
        this.analyser.getFloatFrequencyData(this.freqData);
        return this.freqData.map(val => val < this.analyser.minDecibels ? this.analyser.minDecibels : val);
    }

    /**
     * Change the volume
     * @param value
     */
    setVolume(value:number) {
        this.gain.gain.setValueAtTime(value, 0);
    }

}
