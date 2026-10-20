import { _decorator, Component, Node, Label, Button} from 'cc';
const { ccclass, property } = _decorator;
import { scoreManager } from './ScoreManager';
import { gameManager } from './GameManager';
import { SceneController } from './SceneController';
@ccclass('GameUI')
export class GameUI extends Component {
    @property({type:Label})
    private curScore:Label | null = null;

    @property({type:Label})
    private highScore:Label | null = null;

    @property({ type: Node})
    private overPanel:Node | null = null;

    @property({ type: Button})
    private restartButton: Button | null = null;

    start() {
        scoreManager.onScoreCharged = (curScore,highScore) => {
           this.updateLabelText(curScore,highScore);
        }

        const initScore = scoreManager.getCurrentScore();
        this.updateLabelText(initScore.current,initScore.highScore);

        gameManager.onStateChanged = () => {
            if(this.overPanel){
                this.overPanel.active = true;
            }
        }
        if (this.overPanel) this.overPanel.active = false;
    }

    public onRestartClick() {
        if (this.overPanel) this.overPanel.active = false;
        SceneController.instance?.resetGame();
    }

    public get gameoverPanel():Node{
        return this.overPanel;
    }

    updateLabelText(curScore:number,highScore:number){
        if(this.curScore){ this.curScore.string = '分数：' + curScore.toString();}
        if(this.highScore){ this.highScore.string = '最高：' + highScore.toString();}
    }

    onDestroy() {
        scoreManager.onScoreCharged = null;
        gameManager.onStateChanged = null;
    }
}


