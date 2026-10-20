import { sys } from 'cc';
export class ScoreManager{

    private _scoreCurrent: number = 0;
    private _highScore: number = 0;

    onScoreCharged:((current:number,high:number) => void) | null = null;

    public init(){
        this._highScore = Number(sys.localStorage.getItem('highScore') ?? 0);
        this.notify();
    }

    public getCurrentScore(): { current: number, highScore: number } {
        return { current: this._scoreCurrent, highScore: this._highScore };
    }

    addScore(data:number){
        this._scoreCurrent = this._scoreCurrent + data;
        if(this._scoreCurrent > this._highScore){
            this._highScore = this._scoreCurrent;
            sys.localStorage.setItem('highScore',this._scoreCurrent.toString());
        }
        this.notify();
    }

    reset(){
        this._scoreCurrent = 0
        this.notify();
    }

    private notify(){
        this.onScoreCharged?.(this._scoreCurrent,this._highScore);
    }
}

export const scoreManager = new ScoreManager();
