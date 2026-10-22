import { eventBus } from "./EventBus";
import { GameEvent } from "./GameEvent";
import { Logger } from './Logger';
export enum GameState{
    Ready,
    Playing,
    GameOver,
}

export class GameFSM{
    private _state:GameState = GameState.Ready;

    public get State():GameState{
        return this._state;
    }

    public stateChanged(state:GameState){
        if(state === this._state) return;
        const oldState = this._state;
        this._state = state;
        Logger.log(`状态由${oldState}切换成${state}`);
        if(state === GameState.GameOver){
            Logger.log("游戏结束");
            eventBus.emit(GameEvent.GAME_OVER);
        }
    }

    public reset(){
        this.stateChanged(GameState.Playing);
    }
}

export const gameFSM = new GameFSM();