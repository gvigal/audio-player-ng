import {AudioSource} from "./audio-source";
import {ElementSource} from "./element-source";

export class AudioSourceFactory {

    static getSource(type:string):AudioSource {
        let source:AudioSource;
        switch (type) {
            case 'element':
                source = new ElementSource();
                break;
        }
        source.connectDefault();
        return source;
    }
}
