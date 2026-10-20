import {Vec2, Node, Color,instantiate, UITransform, CircleCollider2D, Sprite, RigidBody2D, ERigidBody2DType, Vec3} from 'cc';
import { CircleType,CIRCLE_CLEAR,CircleColor } from './CircleConfig';
import { SceneController } from './SceneController';
import { DIAMETER_CONVERSION_RADIUS,PREFAB_PRECIRCLE_NAME,DEFAULT_CIRCLE_NAME,SPAWN_NEW } from './GameConst'
class CreateCircle{
    
    private lastCircleNode: Node | null= null;
    private CircleNode: Node | null= null;
    private Cbox: Node | null= null;
    private Diameter: number = 0;
    private Ccount: number = 1;
    private Color: Color = new Color();

    randomCircle() {
        const value:number = Math.floor(Math.random() * 10 / 2);
        const randomnum:any = CIRCLE_CLEAR[value];
        const diameter = CircleType[randomnum];
        const color = CircleColor[value];
        this.Diameter = Number(CircleType[randomnum]);
        this.Color = CircleColor[value];
        return {diameter,color};
    }

    createPreCircle(node1:Node,node2:Node){
        this.CircleNode = node1;
        this.Cbox = node2;
        const preNode = instantiate(node1);
        preNode.name = PREFAB_PRECIRCLE_NAME;

        const result = this.randomCircle();
        const preDiameter = Number(result.diameter);
        const preColor = result.color;

        const preUITransform = preNode.getComponent(UITransform);
        preUITransform.setContentSize(preDiameter, preDiameter);

        const preCircleCollider = preNode.getComponent(CircleCollider2D);
        preCircleCollider.radius = preDiameter * DIAMETER_CONVERSION_RADIUS;

        const preSprite = preNode.getComponent(Sprite);
        preSprite.color = preColor;

        const preRigidBody = preNode.getComponent(RigidBody2D);
        preRigidBody.type = ERigidBody2DType.Kinematic;
        preRigidBody.fixedRotation = false;
        preRigidBody.angularVelocity = Math.PI/2;  
       
        preNode.setPosition(new Vec3(0,0,0));
        node2.addChild(preNode);        
        this.lastCircleNode = preNode;
        
    }

    createCircle(position?: Vec3, num?: number, velocity?: Vec2, resutlColor?: Color) {
        if (!this.CircleNode) {
            console.error("CircleNode prefab 未绑定");
            return;
        }
        if (!this.Cbox) {
            console.error("Cbox 未绑定，请在编辑器把 Canvas/Cbox 拖到属性槽");
            return;
        }

        const newNode = instantiate(this.CircleNode);
        newNode.name = DEFAULT_CIRCLE_NAME + this.Ccount;

        let diameter: number = 0;
        let circolor: Color = new Color();
        if (num === SPAWN_NEW) {
            diameter = this.Diameter; 
            circolor = this.Color;
        } else { 
            diameter = num ?? 0;
            circolor = resutlColor ?? new Color();
        }
        this.Cbox.addChild(newNode);

        const uitransform = newNode.getComponent(UITransform);
        uitransform.setContentSize(diameter, diameter);

        const sprite = newNode.getComponent(Sprite);
        sprite.color = new Color(circolor);

        const circlecollider2d = newNode.getComponent(CircleCollider2D);
        if (circlecollider2d) {
            circlecollider2d.radius = diameter * DIAMETER_CONVERSION_RADIUS;
        }

        newNode.setPosition(position);

        const rb = newNode.getComponent(RigidBody2D);

        if (velocity instanceof Vec2) {
            if (rb) {
                rb.linearVelocity = velocity.clone();
            }
        }else{
           
        }
        if (num === SPAWN_NEW) {
            SceneController.instance?.setInputEnabled(false);

            if (this.lastCircleNode && this.lastCircleNode.isValid) {
                this.lastCircleNode.destroy();
            }
        
            SceneController.instance?.scheduleOnce(() => {
                this.createPreCircle(this.CircleNode,this.Cbox);
                SceneController.instance?.setInputEnabled(true);
                // input.on(Input.EventType.MOUSE_UP, SceneController.instance?.onMouse, this);
            }, 1);
        }
        this.Ccount++;
    }
}

export const CircleCreate = new CreateCircle();

