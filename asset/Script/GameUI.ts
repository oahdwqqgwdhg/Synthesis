import { _decorator, Component, ScorllView, Node, Label, Button} from 'cc';
const { ccclass, property } = _decorator;
import { scoreManager } from './ScoreManager';
import { eventBus } from './EventBus';
import { GameEvent } from './GameEvent';
import { Logger } from './Logger';
import { httpClient } from './HttpClient';
@ccclass('GameUI')
export class GameUI extends Component {
    @property({type:Label})
    private curScore:Label | null = null;

    @property({type:Label})
    private highScore:Label | null = null;

    @property({ type: Node})
    private overPanel:Node | null = null;

     @property({ type: Node })
    private RankList: Node | null = null;

    @property({ type: Button})
    private restartButton: Button | null = null;

    @property({ type: Button})
    private openRanklistbutton: Button | null = null;

    start() {
        const initScore = scoreManager.getCurrentScore();
        this.updateLabelText(initScore.current,initScore.highScore);

        eventBus.on(GameEvent.SCORE_CHANGED,(curScore,highScore) => {this.updateLabelText(curScore,highScore);},this);
        eventBus.on(GameEvent.GAME_OVER,() => {if(this.overPanel) this.overPanel.active = true;},this);
        if (this.overPanel) this.overPanel.active = false;
    }

    public onRestartClick() {
        if (this.overPanel) this.overPanel.active = false;
        eventBus.emit(GameEvent.GAMERE_RESTART);
    }

    public get gameoverPanel():Node{
        return this.overPanel;
    }

    openRankList(){
        eventBus.emit(GameEvent.CLICK_INHIBIT);
        this.RankList.active = true;

        httpClient.getData();
    }

    closeRankList(){
        this.RankList.active = false;
        setTimeout(() => {
            eventBus.emit(GameEvent.CLICK_START);
        },1);   
    }

    updateLabelText(curScore:number,highScore:number){
        if(this.curScore){ this.curScore.string = '分数：' + curScore.toString();}
        if(this.highScore){ this.highScore.string = '最高：' + highScore.toString();}
    }

    onDestroy() {
        eventBus.offTarget(this); 
    }
}


