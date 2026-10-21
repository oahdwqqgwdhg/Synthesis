import { eventBus } from "./EventBus";
import { GameEvent } from "./GameEvent";
export enum GameState{
    Playing,
    GameOver,
}

export class GameManager{
    private _state:GameState = GameState.Playing;

    public get getState():GameState{
        return this._state;
    }

    public setOver(){
        if(this._state == GameState.GameOver) return;
        this._state = GameState.GameOver;
        eventBus.emit(GameEvent.GAME_OVER);
    }

    public reset(){
        this._state = GameState.Playing;
    }
}

export const gameManager = new GameManager();