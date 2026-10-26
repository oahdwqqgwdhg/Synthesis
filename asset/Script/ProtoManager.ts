import { Logger } from './Logger';

//@ts-ignore
// import * as $protobuf from './message.js';
import messageModule from './message.js';

class ProtoManager{
    public PlayerAction: any = null;
    public init(){
        try{
            this.PlayerAction = (messageModule as any).PlayerAction || messageModule;
            Logger.log("Protobuf静态模块初始化成功");
        }catch(e){
            Logger.log("协议初始化失败",e);
        }
        
    }
}

export const protoManager = new ProtoManager();