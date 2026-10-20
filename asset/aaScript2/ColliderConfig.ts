import { UITransform,Vec3,RigidBody2D,Vec2} from 'cc';
import { CircleConfig } from './CircleConfig'
import { SceneController } from './SceneController'
import { CircleCreate } from './CreateCircle'
import { ColliderController } from './ColliderController'

// @ccclass('ColliderConfig')
export class ColliderConfig{

    // static instance: ColliderConfig | null = null;

    // onLoad(){
    //     if(ColliderConfig.instance){
    //         this.node.destroy();
    //         return;
    //     }
    //     ColliderConfig.instance = this;
    // }

    getColliderConfig(data:any) {
        const selfCtrl = data.selfNode.getComponent(ColliderController); //只能拿@ccclass注册过的---组件类
        const otherCtrl = data.otherNode.getComponent(ColliderController);
        if (!otherCtrl || !selfCtrl) return;
 
        if (selfCtrl.handled || otherCtrl.handled) return;

        const selfcircle = data.selfNode.getComponent(UITransform);
        const othercircle = data.otherNode.getComponent(UITransform);
        if (!selfcircle || !othercircle) return;

        if (selfcircle.contentSize.width !== othercircle.contentSize.width ||
            selfcircle.contentSize.height !== othercircle.contentSize.height) return;

        selfCtrl.handled = true;
        otherCtrl.handled = true;
        
        const result = CircleConfig.getResultCircle(selfcircle.contentSize.width);
        if (!result) {
            selfCtrl.handled = false;
            otherCtrl.handled = false;
            return;
        }
        const newDiameter = result.diameter;
        const resultColor = result.color;
        // console.log("颜色：",resultColor);
        
        const p1 = new Vec3();
        const p2 = new Vec3();
        data.selfNode.getWorldPosition(p1);
        data.otherNode.getWorldPosition(p2);
        const worldMid = new Vec3((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, 0);

        const rb1 = data.selfNode.getComponent(RigidBody2D);
        const rb2 = data.otherNode.getComponent(RigidBody2D);
        const v1 = rb1 ? rb1.linearVelocity.clone() : new Vec2();
        const v2 = rb2 ? rb2.linearVelocity.clone() : new Vec2();
        const avgVel = new Vec2((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);

        const selfNode = data.selfNode;
        const otherNode = data.otherNode;

        setTimeout(() => {

            if (!selfNode.isValid || !otherNode.isValid) {
                selfCtrl.handled = false;
                if (otherCtrl.isValid) otherCtrl.handled = false;
                return;
            }

            if (selfNode.isValid) selfNode.destroy();
            if (otherNode.isValid) otherNode.destroy();

            const cbox = SceneController.instance?.cboxNode;
            if (!cbox) {
                console.error("Cbox 未绑定");
                return;
            }
            const cboxUI = cbox.getComponent(UITransform);
            const localMid = cboxUI.convertToNodeSpaceAR(worldMid);

            CircleCreate.createCircle(localMid, newDiameter, avgVel, resultColor);
        }, 0);
    }
}

export const colliderConfig = new ColliderConfig();
 

