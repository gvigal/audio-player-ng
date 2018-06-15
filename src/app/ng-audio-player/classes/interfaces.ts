/**
 * Created by gvi on 26/04/18.
 */


export interface OptionsPlayer {

    width:number;
    height?:number;
    graphicsWidth?:number;
    graphicsHeight?:number;
    oscFillStyle:string;
    oscStrokeStyle:string;
    freqFillStyle:string;
    freqStrokeStyle:string;
    freqBars?:number;
    playlistPosition?:string;
    loadDuration?:boolean;
}

export interface DiscData {
    group:string;
    discs:[{
        title:string,
        url:string
    }];
}

export interface SongData {
    title:string;
    url:string;
    group?:string;
    disc?:string;
    duration?:number;
}

export interface PlaylistData {
    title:string;
    group?:string;
    songs:SongData[];
}