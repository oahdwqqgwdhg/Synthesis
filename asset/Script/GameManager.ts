export enum GameState{
    Playing,
    GameOver,
}

export class GameManager{
    private _state:GameState = GameState.Playing;

    public onStateChanged:(() => void) | null = null;

    public get getState():GameState{
        return this._state;
    }

    public setOver(){
        if(this._state == GameState.GameOver) return;
        this._state = GameState.GameOver;
        this.onStateChanged?.();
    }

    public reset(){
        this._state = GameState.Playing;
    }
}

export const gameManager = new GameManager();