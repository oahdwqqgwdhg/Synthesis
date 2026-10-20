import { _decorator, Component, Node, RigidBody2D, Input, input, Vec3, EventMouse, UITransform, PhysicsSystem2D, Prefab, } from 'cc';
const { ccclass, property } = _decorator;
import { circleSpawner } from './CircleSpawner';
import { FACTOR_HALF,PREFAB_PRECIRCLE_NAME } from './GameConst';
import { scoreManager } from './ScoreManager';
import { gameManager,GameState } from './GameManager';
import { AudioManager } from './AudioManager';
@ccclass('SceneController')
export class SceneController extends Component {

    @property({ type: Prefab })
    private CircleNode: Prefab | null = null;

    @property({ type: Node })
    private Cbox: Node | null = null;

    @property({ type: Node})
    private redLine: Node | null = null;

    static instance: SceneController | null = null;

    private _overTime: number = 0;

    onLoad() {
        if(SceneController.instance){
            this.node.destroy()
            return;
        }
        SceneController.instance = this;
        PhysicsSystem2D.instance.enable = true;
    }

    start() {
        gameManager.reset();
        circleSpawner.init(this.CircleNode,this.Cbox);
        scoreManager.init();
        circleSpawner.onSpawnStart = () => this.setInputEnabled(false);
        circleSpawner.onSpawnEnd = () => this.setInputEnabled(true);
        circleSpawner.spawnPreview();
        this.setInputEnabled(true);
    }

    get cboxNode(): Node | null {
        return this.Cbox;
    }

    onMouse(event: EventMouse) {
        const value = event.getButton();
        switch (value) {
            case 0:
                this.clickstartfall(event);
                AudioManager.instance?.playSpawn();
                break;
            case 2:
                // if (this.Cbox) this.cleanAllCircle(this.Cbox);
                circleSpawner.reset();
                scoreManager.reset();
                // circlePool.clear();
                console.log("清空成功");
                break;
            default:
                break;
        }
    }

    setInputEnabled(enabled: boolean) {
        if (enabled) {
            input.on(Input.EventType.MOUSE_UP, this.onMouse, this);
        } else {
            input.off(Input.EventType.MOUSE_UP, this.onMouse, this);
        }
    }


    clickPosition(data: EventMouse) {
        if (!this.Cbox) {
            console.error("Cbox 未绑定，请在编辑器把 Canvas/Cbox 拖到属性槽");
            return new Vec3(0, 0, 0);
        }
        const mouseposition = data.getUILocation();
        const uiTransform = this.Cbox.getComponent(UITransform);
        const localPos = uiTransform.convertToNodeSpaceAR(
            new Vec3(mouseposition.x, mouseposition.y, 0)
        );

        const halfW = uiTransform.contentSize.width * FACTOR_HALF;
        const x = Math.max(-halfW, Math.min(halfW, localPos.x));   // clamp
        return new Vec3(x, 0, 0);
    }

    clickstartfall(event:EventMouse){
        this.scheduleOnce(() => {
            if (!this.node.isValid) {
                return; 
            }
            circleSpawner.spawnFalling(this.clickPosition(event));
        }, 0);
    }

    onDestroy(){
        if(SceneController.instance == this){
            SceneController.instance = null;
        }
        this.setInputEnabled(false);
    }

    update(time:number){
        if(gameManager.getState == GameState.GameOver) return;
        let _isfailed: boolean = false;
        if(this.redLine){
            const redline = this.redLine.getComponent(UITransform);
            for (const child of this.Cbox.children) {
                if(!child.active || child.name.startsWith(PREFAB_PRECIRCLE_NAME)) continue;
                if(child.worldPosition.y >= this.redLine.worldPosition.y){
                    const cv = child.getComponent(RigidBody2D);
                    if(cv && cv.linearVelocity.length() < 10){
                        _isfailed = true;
                        break;
                    }
                }
            }
        }

        if(_isfailed){
            this._overTime += time;
            // console.log(this._overTime);
            if(this._overTime >=1.0){
                console.log("游戏失败");
                gameManager.setOver();
                this.setInputEnabled(false);
                this._overTime = 0;
                AudioManager.instance?.playGameOver();
            }
        }else{
            this._overTime = 0;
        }
    }

    resetGame(){
        circleSpawner.reset();
        scoreManager.reset();
        gameManager.reset();
        this.setInputEnabled(true);
    }
}


