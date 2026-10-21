import { _decorator, Component, AudioSource, AudioClip } from 'cc';
const { ccclass, property } = _decorator;
import { GameEvent } from './GameEvent';
import { eventBus } from './EventBus';

@ccclass('AudioManager')
export class AudioManager extends Component{

    private _audioSource: AudioSource | null = null;

    @property({type:AudioClip})
    public spawnClip: AudioClip | null = null;
    @property({type:AudioClip}) 
    public synthesisClip: AudioClip | null = null;
    @property({type:AudioClip})
    public gameoverClip: AudioClip | null = null;
    static instance:AudioManager | null = null;

    onLoad() {
        this._audioSource = this.getComponent(AudioSource);
        if (!this._audioSource) {
            this._audioSource = this.addComponent(AudioSource);
        }
        eventBus.on(GameEvent.AUDIO_START,this.playSpawn,this);
        eventBus.on(GameEvent.AUDIO_START,this.playSynthesis,this);
    }

    start(){
        if(AudioManager.instance){
            this.node.destroy();
        }
        AudioManager.instance = this;
    }

    playSpawn(){
        if(this._audioSource){
            if(this.spawnClip){
                this._audioSource.playOneShot(this.spawnClip,1.0);
            }
        }
    }

    playSynthesis(){
        if(this._audioSource){
            if(this.synthesisClip){
                this._audioSource.playOneShot(this.synthesisClip,1.0);
            }

        }
    }

    playGameOver(){
        if(this._audioSource){
            if(this.gameoverClip){
                this._audioSource.playOneShot(this.gameoverClip,2.0);
            }
        }
    }

}


