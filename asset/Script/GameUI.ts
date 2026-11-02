import { _decorator, Component, instantiate, Node, Label, Prefab} from 'cc';
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

    @property({ type: Prefab})
    private itemRankPrefab: Prefab | null = null;

    @property({ type: Node})
    private contentNode: Node | null = null;

    start() {
        const initScore = scoreManager.getCurrentScore();
        this.updateLabelText(initScore.current,initScore.highScore);

        eventBus.on(GameEvent.SCORE_CHANGED,(curScore,highScore) => {this.updateLabelText(curScore,highScore);},this);
        eventBus.on(GameEvent.GAME_OVER,() => {if(this.overPanel) this.overPanel.active = true;},this);
        eventBus.on(GameEvent.LEADERBOARD_UPDATED,this.updateLeaderbord,this)
        if (this.overPanel) this.overPanel.active = false;
    }

    public onRestartClick() {
        if (this.overPanel) this.overPanel.active = false;
        eventBus.emit(GameEvent.GAMERE_RESTART);
    }

    public get gameoverPanel():Node{
        return this.overPanel;
    }

    async openRankList(){
        eventBus.emit(GameEvent.CLICK_INHIBIT);
        this.RankList.active = true;
        const list = await httpClient.getLeaderboard();
        this.updateLeaderbord(list);
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

    updateLeaderbord(data:{name:string,score:number}[]){
        if(!this.itemRankPrefab || !this.contentNode) return;
        this.contentNode.removeAllChildren();
        Logger.log("获取的排行榜列表打印：",data);
        data.forEach((player,index) => {
            const itemNode = instantiate(this.itemRankPrefab);

            const rankLabel = itemNode.getChildByName('ranking')?.getComponent(Label);
            const nameLabel = itemNode.getChildByName('name')?.getComponent(Label);
            const scoreLabel = itemNode.getChildByName('score')?.getComponent(Label);

            if(rankLabel) rankLabel.string = `${index + 1}`;
            if(nameLabel) nameLabel.string = player.name;
            if(scoreLabel) scoreLabel.string = `${player.score}`;

            this.contentNode.addChild(itemNode);
            Logger.log(`第${index}个，玩家数据为：${player.name}`);
        });
    }

    onDestroy() {
        eventBus.offTarget(this); 
    }
}


