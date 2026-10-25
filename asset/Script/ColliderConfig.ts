import { UITransform,Vec3,RigidBody2D,Vec2,tween} from 'cc';
import { getNextCircle } from './CircleData';
import { SceneController } from './SceneController'
import { circleSpawner } from './CircleSpawner'
import { ColliderController } from './ColliderController'
import { scoreManager } from './ScoreManager';
import { circlePool } from './CirclePool';
import { Logger } from './Logger';

// @ccclass('ColliderConfig')
export class ColliderConfig{


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
        
        const result = getNextCircle(selfcircle.contentSize.width);
        if (!result) {
            selfCtrl.handled = false;
            otherCtrl.handled = false;
            return;
        }
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

        setTimeout(() => {
            if (rb1) rb1.enabled = false;
            if (rb2) rb2.enabled = false;
        }, 0);
        
        const selfNode = data.selfNode;
        const otherNode = data.otherNode;

        const onFinish = () =>{

            if (!selfNode.isValid || !otherNode.isValid) {
                selfCtrl.handled = false;
                if (otherCtrl.isValid) otherCtrl.handled = false;
                return;
            }
            
            circlePool.put(data.selfNode);
            circlePool.put(data.otherNode);

            const cbox = SceneController.instance?.cboxNode;
            if (!cbox) {
                Logger.error("Cbox 未绑定");
                return;
            }
            const cboxUI = cbox.getComponent(UITransform);
            const localMid = cboxUI.convertToNodeSpaceAR(worldMid);
            
            circleSpawner.spawnMerged(localMid, result, avgVel);
            scoreManager.addScore(result.score);
        };

        tween(selfNode)
            .to(0.1, { scale: new Vec3(1.2, 1.2, 1) })
            .to(0.1, { scale: new Vec3(0, 0, 1) })
            .call(onFinish)
            .start();

        tween(otherNode)
            .to(0.1, { scale: new Vec3(1.2, 1.2, 1) })
            .to(0.1, { scale: new Vec3(0, 0, 1) })
            .start();
        
    }
}

export const colliderConfig = new ColliderConfig();
 

