import {Vec2, Node, Vec3, Prefab} from 'cc';
import { getById,RANDOM_SPAWN_MAX_ID,ICircleConfig } from './CircleData';
import { CircleFactory } from './CircleFactory';
import { DEFAULT_CIRCLE_NAME } from './GameConst'
import { circlePool } from './CirclePool';
import { AudioManager } from './AudioManager';
import { eventBus } from './EventBus';
import { GameEvent } from './GameEvent';
import { Logger } from './Logger';
import { GameState } from './GameFSM';
class CircleSpawner{
    private prefab:Prefab | null =null;
    private cbox: Node | null= null;
    private lastCircleNode: Node | null= null;
    private Ccount: number = 1;
    private _pendingconfig: ICircleConfig | null =null;
    
    init(prefab:Prefab,cbox:Node){
        if (!prefab || !cbox) {
            Logger.error("CircleSpawner 未初始化");
            return;
        }   
        this.prefab = prefab;
        this.cbox = cbox;
        circlePool.init(this.prefab);
    }

    randomCircle():ICircleConfig | undefined {
        const value:number = Math.floor(Math.random() * RANDOM_SPAWN_MAX_ID) + 1;
        const randomcircle = getById(value);
        if(randomcircle) return randomcircle; 
    }

    spawnPreview(){
        if (!this.prefab || !this.cbox || !this.cbox.isValid) return;
        const preCircle = this.randomCircle();
        if(!preCircle) return;
        this._pendingconfig = preCircle;
        const resultNode = CircleFactory.createPreview(preCircle);
        this.cbox.addChild(resultNode);        
        this.lastCircleNode = resultNode;
    }

    spawnFalling(position?: Vec3){
        if (!this.prefab) {
            Logger.error("prefab 未绑定");
            return;
        }
        if (!this.cbox) {
            Logger.error("cbox 未绑定，请在编辑器把 Canvas/cbox 拖到属性槽");
            return;
        }
        if(this._pendingconfig){
            const resultNode = CircleFactory.createFalling(this._pendingconfig,position);
            resultNode.name = DEFAULT_CIRCLE_NAME + this.Ccount;
            this.cbox.addChild(resultNode);
            this.Ccount++;
        }
        eventBus.emit(GameEvent.CLICK_START);
        if (this.lastCircleNode && this.lastCircleNode.isValid) {
            circlePool.put(this.lastCircleNode);
        }
        setTimeout(() => {
            if (!this.cbox || !this.cbox.isValid) return;
            this.spawnPreview();
            eventBus.emit(GameEvent.CLICK_INHIBIT);
        }, 1000);
    }

    spawnMerged(position: Vec3, result: ICircleConfig, velocity?: Vec2) {
        AudioManager.instance?.playSynthesis();
        if (!this.prefab) {
            Logger.error("prefab 未绑定");
            return;
        }
        if (!this.cbox) {
            Logger.error("cbox 未绑定，请在编辑器把 Canvas/cbox 拖到属性槽");
            return;
        }
        
        const resultNode = CircleFactory.createFalling(result,position,velocity);
        resultNode.name = DEFAULT_CIRCLE_NAME + this.Ccount;
        this.cbox.addChild(resultNode);
        this.Ccount++;
    }

    reset(){
        if (!this.cbox || !this.cbox.isValid) return;
        const child = this.cbox.children;
        const name = DEFAULT_CIRCLE_NAME;
        for (let i = child.length - 1; i >= 0; i--) {
            if (child[i].name.startsWith(name)) {
                circlePool.put(child[i]);
            }
        }
        this.Ccount = 1;
        this.lastCircleNode = null;
        eventBus.offTarget(this);
    }
}

export const circleSpawner = new CircleSpawner();

