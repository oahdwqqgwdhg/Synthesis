import { _decorator, Component, Node, Input, input, Vec3, EventMouse, UITransform, PhysicsSystem2D, Prefab, } from 'cc';
const { ccclass, property } = _decorator;
import { CircleCreate } from './CreateCircle';
import { DEFAULT_CIRCLE_NAME,FACTOR_HALF } from './GameConst';

@ccclass('SceneController')
export class SceneController extends Component {

    @property({ type: Prefab })
    private CircleNode: Prefab | null = null;

    @property({ type: Node })
    private Cbox: Node | null = null;

    static instance: SceneController | null = null;

    onLoad() {
        if(SceneController.instance){
            this.node.destroy()
            return;
        }
        SceneController.instance = this;
        PhysicsSystem2D.instance.enable = true;
    }

    start() {
        // const eventCenter = new EventCenter('points',true);
        CircleCreate.createPreCircle(this.CircleNode,this.Cbox);
        // input.on(Input.EventType.MOUSE_UP, this.onMouse, this);
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
                break;
            case 2:
                if (this.Cbox) this.cleanAllCircle(this.Cbox);
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

    cleanAllCircle(node: Node) {
        const child = node.children;
        const name = DEFAULT_CIRCLE_NAME;
        for (let i = child.length - 1; i >= 0; i--) {
            if (child[i].name.startsWith(name)) {
                child[i].destroy();
            } else {
                this.cleanAllCircle(child[i]);
            }
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
        console.log("点击坐标localPos：",x);
        return new Vec3(x, 0, 0);
    }

    clickstartfall(event:EventMouse){
        this.scheduleOnce(() => {
            if (!this.node.isValid) {
                return; 
            }
            CircleCreate.createCircle(this.clickPosition(event), 0);
        }, 0);
    }

    onDestroy(){
        if(SceneController.instance == this){
            SceneController.instance = null;
        }
        this.setInputEnabled(false);
    }
}


