import { _decorator, Component, Contact2DType, Event, Collider2D, Vec2, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;
import { colliderConfig } from './ColliderConfig';


class CustomEvent extends Event{
    public msg: any = null;
    constructor(event:string,bubbles?:boolean,msg?:any){
        super(event,bubbles?bubbles:true);
        this.msg = msg?msg:null;
    }
}

@ccclass('ColliderController')
export class ColliderController extends Component {
    
    public handled: boolean = false;
    private lastImpulse: Vec2 = new Vec2(0, 0);

    onLoad() {
        this.node.on('hit',this.onCrash,this);
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const evt = new CustomEvent('hit',false,{
            self:selfCollider,
            other:otherCollider,
            selfNode:selfCollider.node,
            otherNode:otherCollider.node,
        }); 
        this.node.dispatchEvent(evt);
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log("碰撞结束");
    }

    onPostSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (!contact) return;
        const impulse = contact.getImpulse();
        if (impulse && impulse.normalImpulses.length > 0) {
            this.lastImpulse.set(impulse.normalImpulses[0], 0);
        }
    }

    onCrash(event:CustomEvent){
        const data = event.msg;
        if(!data) return;
        console.log("碰撞函数执行：",data);
        colliderConfig.getColliderConfig(data);
    }

    onDestroy(){
        this.node.off('hit',this.onCrash,this);
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.POST_SOLVE, this.onPostSolve, this);
        }
    }
}


