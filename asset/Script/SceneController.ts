import { _decorator, Component, Node, RigidBody2D, Input, input, Vec3, EventMouse, UITransform, PhysicsSystem2D, Prefab, } from 'cc';
const { ccclass, property } = _decorator;
import { circleSpawner } from './CircleSpawner';
import { FACTOR_HALF,PREFAB_PRECIRCLE_NAME } from './GameConst';
import { scoreManager } from './ScoreManager';
import { gameFSM,GameState } from './GameFSM';
import { AudioManager } from './AudioManager';
import { eventBus } from './EventBus';
import { GameEvent } from './GameEvent';
import { initCircleData } from './CircleData';
import { Logger } from './Logger';
import { httpClient } from './HttpClient';
import { wsClient } from './WsClient';
import { protoManager } from './ProtoManager';

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

    async start() {
        Logger.setDebug(true);
        const login = await httpClient.login('admin','123123') ?? null;
        if(login){
            await httpClient.getData();
        }
        gameFSM.reset();
        circleSpawner.init(this.CircleNode,this.Cbox);
        scoreManager.init();
        eventBus.on(GameEvent.CLICK_START,() => this.setInputEnabled(true),this);
        eventBus.on(GameEvent.CLICK_INHIBIT,() => this.setInputEnabled(false),this);
        eventBus.on(GameEvent.GAMERE_RESTART,this.resetGame,this);
        try{
            await initCircleData();
        }catch(e){
            Logger.log("[CircleData]配置加载失败:",e);
        }

        circleSpawner.spawnPreview();
        eventBus.emit(GameEvent.CLICK_START);
        await protoManager.init();
        wsClient.connect();
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

                const pos = this.clickPosition(event);
                wsClient.sendAction("player_001","drop",scoreManager.getCurrentScore().current,pos.x)
                break;
            case 2:
                circleSpawner.reset();
                scoreManager.reset();
                Logger.log("清空成功");
                // wsClient.sendAction("play1，点击清空按钮");
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
            Logger.error("Cbox 未绑定，请在编辑器把 Canvas/Cbox 拖到属性槽");
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
        eventBus.offTarget(this);
    }

    update(time:number){
        if(gameFSM.State !== GameState.Playing) return;
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
            if(this._overTime >=1.0){
                Logger.log("游戏失败");
                gameFSM.stateChanged(GameState.GameOver);
                this.setInputEnabled(false);
                this._overTime = 0;
                AudioManager.instance?.playGameOver();
            }
        }else{
            this._overTime = 0;
        }
    }


    resetGame(){
        scoreManager.reset();
        gameFSM.reset();
        this.scheduleOnce(() => {
            circleSpawner.reset();
            eventBus.emit(GameEvent.CLICK_START);
        },0);
    }
}


