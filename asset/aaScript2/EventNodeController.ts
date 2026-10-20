import { _decorator, Component, Node, UITransform, Label, Color, EventTouch, Event, input, Input, Vec3 } from 'cc';
const { ccclass } = _decorator;
import { EventBus } from './owerevent';

export class MyEvent extends Event{
    constructor(name:string , bubbles?:boolean,detail?: any){
        super(name,bubbles);
        this.detail = detail;
    }
    public detail: any = null;
}

@ccclass('EventBubbleDemo')
export class EventBubbleDemo extends Component {

    private parentNode!: Node;
    private childNode!: Node;
    private grandChildNode!: Node;


    onLoad () {
        // 1. 搭建节点树：Parent -> Child -> GrandChild
        this.parentNode = this.createBox('Parent', new Vec3(200, 50, 0), new Color(255, 100, 100));
        this.childNode = this.createBox('Child', new Vec3(-200, -50, 0), new Color(100, 255, 100));
        this.grandChildNode = this.createBox('GrandChild', new Vec3(-200, -50, 0), new Color(100, 100, 255));

        this.parentNode.addChild(this.childNode);
        this.childNode.addChild(this.grandChildNode);

        // 2. 注册节点触摸事件（会冒泡）
        this.parentNode.on(Node.EventType.TOUCH_START, this.onParentTouch, this);
        this.childNode.on(Node.EventType.TOUCH_START, this.onChildTouch, this);
        this.grandChildNode.on(Node.EventType.TOUCH_START, this.onGrandChildTouch, this);
        this.childNode.on('dianji',this.onMyEvent,this);

        // 3. 注册自定义事件监听（也会冒泡）
        // this.parentNode.on('my-event', this.onParentCustom, this);
        // this.childNode.on('my-event', this.onChildCustom, this);
        // this.grandChildNode.on('my-event', this.onGrandChildCustom, this);

        // 4. 全局 input 监听，对比用
        // input.on(Input.EventType.TOUCH_START, this.onGlobalTouch, this);

        this.node.addChild(this.parentNode);

        // 5. 延迟触发一次自定义事件，演示冒泡
        // this.scheduleOnce(() => {
        //     console.log('=== 派发自定义事件 my-event ===');s
        //     this.grandChildNode.emit('my-event', 'hello');
        // }, 1);
    }

    onDestroy () {
        // input.off(Input.EventType.TOUCH_START, this.onGlobalTouch, this);
    }

    // ---------- 节点触摸回调 ----------

    onParentTouch (event: EventTouch) {
        console.log('[触摸] Parent 收到');
        this.scheduleOnce(()=>{
            if (!this.node.isValid) {
                return; 
            }
            this.childNode.dispatchEvent( new MyEvent('dianji',true,{hp: 100, name: 'hero'}));
        },);
    }

    onMyEvent(event:MyEvent){
        console.log("自定义事件MyEvent:",event.detail);
    }

    onChildTouch (event: EventTouch) {
        console.log('[触摸] Child 收到');
        // 想阻止冒泡，把下面这行取消注释
        // event.stopPropagation();
    }

    onGrandChildTouch (event: EventTouch) {
        console.log('[触摸] GrandChild 收到');
        // 想阻止冒泡，把下面这行取消注释
        // event.stopPropagation();
    }

    // ---------- 自定义事件回调 ----------

    onParentCustom (msg: string) {
        console.log('[自定义] Parent 收到:', msg);
    }

    onChildCustom (msg: string) {
        console.log('[自定义] Child 收到:', msg);
    }

    onGrandChildCustom (msg: string) {
        console.log('[自定义] GrandChild 收到:', msg);
    }

    // ---------- 全局 input 回调 ----------

    onGlobalTouch (event: EventTouch) {
        console.log('[全局 input] 触摸发生');
    }

    // ---------- 工具方法：创建一个带 UITransform 和 Label 的方块 ----------

    private createBox (name: string, pos: Vec3, color: Color): Node {
        const node = new Node(name);
        node.setPosition(pos);

        // const ui = node.addComponent(UITransform);
        // ui.setContentSize(300, 300);   // 每个节点 300x300，子节点会覆盖在父节点上

        const label = node.addComponent(Label);
        label.string = name;
        label.fontSize = 40;
        label.color = color;
        label.overflow = Label.Overflow.CLAMP;

        const ui = node.getComponent(UITransform)!;
        ui.setContentSize(300, 300);

        return node;
    }
}