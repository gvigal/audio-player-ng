

/**
 * Options player
 */
export interface OptionsPlayer {

    // width of the player
    width:number;

    // height of the graphics panel, default: 60px
    graphicsHeight?:number;

    // background-color of the oscilloscope panel
    oscFillStyle:string;

    // front color of the oscilloscope panel
    oscStrokeStyle:string;

    // background-color of the chartbar panel, default: "oscFillStyle"
    freqFillStyle?:string;

    // front color of the chartbar panel, default: "oscStrokeStyle"
    freqStrokeStyle?:string;

    // number of the of the bars of the chartbar panel, default: 32
    freqBars?:number;

    // the values of playlist position are the flex-direction values:
    // column-reverse (top), row (right), column (bottom), row-reverse (left);
    // default: column (bottom)
    playlistPosition?:string;

    // load the song duration from metadata, it makes a request for song, default: true
    loadDuration?:boolean;
}


/**
 * Song data
 */
export interface SongData {

    // title of the song
    title:string;

    // url of the song
    url:string;

    // group of the song if available
    group?:string;

    // disc of the song if available
    disc?:string;

    // duration of the song, if it is not available can be loaded from "options.loadDuration = true"
    duration?:number;
}

/**
 * Playlist data
 */
export interface PlaylistData {

    // title of the playlist or disc
    title:string;

    // group of the playlist if it is a disc
    group?:string;

    // the songs, array de SongData objects
    songs:SongData[];
}