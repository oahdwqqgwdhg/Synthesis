import { GameEventKey } from "./GameEvent";
import { Logger } from './Logger';
type Handler = (...args:any[]) => void;
interface Listener{
    handler?:Handler,
    target?:object,
    once?:boolean,
}

export class EventBus{
    private static _instance:EventBus | null = null;

    public static get instance():EventBus{
        if(!this._instance) this._instance = new EventBus();
        return this._instance;
    }

    private _map:Map<GameEventKey,Listener[]> = new Map();

    on(event: GameEventKey,handler?:Handler,target?:object){
        this._add(event,handler,target,false);
    }

    once(event: GameEventKey,handler?: Handler, target?:object){
        this._add(event,handler,target,true)
    }

    off(event: GameEventKey,handler?: Handler,target?:object){
        const list = this._map.get(event);
        if(!list) return;
        if(!handler && !target){
            this._map.delete(event);
        }
        for(let i = list.length - 1; i>=0 ; i--){
            if((!handler || list[i].handler === handler)&&(!target || list[i].target === target)){
                list.splice(i,1);
            }
        }
        if(list.length === 0) this._map.delete(event);
    }

    offTarget(target: object){
        this._map.forEach((list,event) => {
            for(let i = list.length - 1; i >= 0;i--){
                if(list[i].target == target){
                    list.splice(i,1);
                }
            }
            if(list.length === 0) this._map.delete(event);
        });
    }

    emit(event: GameEventKey,...args:any[]){
        const list = this._map.get(event);
        if(!list || list.length === 0) return;
        const newlist = list.slice();
        for(const l of newlist){
            if(l.handler){
                if(l.target){
                    l.handler.apply(l.target,args);
                }else{
                    l.handler(...args);
                }
            }
            if(l.once){
                this.off(event,l.handler,l.target);
            }
        }
    }

    private _add(event: GameEventKey,handler?:Handler,target?:object,once?:boolean){
        let list = this._map.get(event);
        if(!list){
            list = [];
            this._map.set(event,list);
        }

        for(const l of list){
            if(l.handler === handler && l.target === target){
                l.once = once;
                return;
            }  
        }

        list.push({handler,target,once});
    }
}

export const eventBus = EventBus.instance;
