import {Node,Vec2,Vec3,UITransform,CircleCollider2D,Sprite,RigidBody2D,ERigidBody2DType} from 'cc'
import { ICircleConfig } from './CircleData';
import { PREFAB_PRECIRCLE_NAME,DIAMETER_CONVERSION_RADIUS } from './GameConst';
import { circlePool } from './CirclePool';
import { Logger } from './Logger';
export class CircleFactory{

    static createPreview(config:ICircleConfig,position?:Vec3){
        const preNode = circlePool.get();
        preNode.name = String(PREFAB_PRECIRCLE_NAME);
        CircleFactory.applyCommon(preNode,config);

        const preRigid2D = preNode.getComponent(RigidBody2D);
        preRigid2D.type = ERigidBody2DType.Kinematic;
        preRigid2D.fixedRotation = false;
        preRigid2D.angularVelocity = Math.PI/2;
        preNode.setPosition(position ?? new Vec3(0,0,0));

        return preNode;
    }

    static createFalling(config:ICircleConfig,position:Vec3,velocity?:Vec2){

        const fallNode = circlePool.get();
        CircleFactory.applyCommon(fallNode,config);
        const fallRigidBody2D = fallNode.getComponent(RigidBody2D);
         if (fallRigidBody2D) {
            fallRigidBody2D.type = ERigidBody2DType.Dynamic;   
            if (velocity instanceof Vec2) {
                fallRigidBody2D.linearVelocity = velocity.clone();
                fallRigidBody2D.angularVelocity = 0;
            }
        }
        fallNode.setPosition(position);
        return fallNode;
    }

    private static applyCommon(node:Node,circle:ICircleConfig){
        const preUITransform = node.getComponent(UITransform);
        preUITransform.setContentSize(circle.diameter,circle.diameter);

        const preCircleCollider = node.getComponent(CircleCollider2D);
        preCircleCollider.radius = circle.diameter * DIAMETER_CONVERSION_RADIUS;

        const preSprite = node.getComponent(Sprite);
        preSprite.color = circle.color;
    }
}
