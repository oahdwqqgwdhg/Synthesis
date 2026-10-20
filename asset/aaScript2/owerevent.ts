import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

type Handler = (...args: any) => void;

export class EventBusHandler{
    private listeners: Map<string,Handler[]> = new Map();

    on(event:string,handler:Handler,target?:any){
        if(!this.listeners.has(event)){
            this.listeners.set(event,[]);
        }
        const bound = target? handler.bind(target) : handler;
        (bound as any).__origin = handler;
        (bound as any).__target = target;

        this.listeners.get(event)?.push(bound);
    }

    off(event:string,handler?:Handler,target?:any){
        const list = this.listeners.get(event);
        if(!list) return;
        if(!handler){
            this.listeners.delete(event);
            return;
        }
        const index = list.findIndex(h => 
            (h as any).__origin == handler && (h as any).__target == target
        );
        if(index >= 0){
            list.splice(index,1);
        }
    }

    dispatch(event:string,...args:any[]){
        const list = this.listeners.get(event);
        if(!list || list.length === 0) return;
        const copy = list.slice();
        for(const handler of copy){
            handler(...args);
        }
    }

    once(event:string,handler:Handler,target?: any){
        const wrapper = (...args: any[])=>{
            this.off(event,wrapper,target);
            handler.apply(target,args);
        };
        (wrapper as any).__origin = handler;
        (wrapper as any).__target = target;
        this.on(event,wrapper,target);
    }
}

export const EventBus = new EventBusHandler();

