import { Node, NodePool, Prefab, instantiate, RigidBody2D, Vec2 } from 'cc';
import { ColliderController } from './ColliderController';
export class CirclePool{

    private _pool:NodePool = new NodePool();
    private _activeNode:Set<Node> = new Set();
    private _prefab:Prefab | null = null;

    public init(prefab:Prefab){
        this._prefab = prefab;
    }

    get(): Node | null{
        if(!this._prefab){
            console.log("小球未找到");
            return null;
        }
        let node: Node;
        if(this._pool.length > 0) {
            node = this._pool.get()!;
        }else{
            node = instantiate(this._prefab);
        }
        this._activeNode.add(node);
        return node;
    }

    put(node:Node){
        if(!node || !node.isValid ) return;
        if(!this._activeNode.has(node)) return;
        
        this._activeNode.delete(node);

        const ctrl = node.getComponent(ColliderController);
        if (ctrl) ctrl.resetState();

        const rigidbody = node.getComponent(RigidBody2D);
        if(rigidbody){
            rigidbody.linearVelocity = new Vec2(0, 0);
            rigidbody.angularVelocity = 0;
        }
        
        node.setPosition(0,0,0);
        node.setScale(1,1,1)
        node.angle = 0;
        node.removeFromParent();

        this._pool.put(node);
    }

    public clear(){
        this._pool.clear();
        this._activeNode.clear();
    }
}

export const circlePool = new CirclePool();


