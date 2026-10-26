import { Logger } from "./Logger";
import { protoManager } from "./ProtoManager";
class WsClient{
    private ws: WebSocket | null = null;
    private url: string = 'ws://localhost:8080';

    public connect(){
        if(this.ws) return;
        
        this.ws = new WebSocket(this.url);
        this.ws.binaryType = 'arraybuffer';

        this.ws.onopen = () => {
            Logger.log("WebSocket连接成功");
        };

        this.ws.onmessage = (event) => {
            const data = event.data;
            if(typeof data === 'string') return;
            try{
                const uint8Array = new Uint8Array(data);
                const decode = protoManager.PlayerAction.decode(uint8Array);
                const obj = protoManager.PlayerAction.toObject(decode);
                Logger.log("收到服务器广播:",obj);
            }catch(e){
                Logger.log("Probuf解码失败",e);

            }
        };

        this.ws.onerror = (err) => {
            Logger.error("WebSocket错误：",err);
        };

        this.ws.onclose = () => {
            Logger.log("WebSocket成功断开连接");
            this.ws = null;
        }
    }

    public sendAction(playerId:string,action:string,score:number,x:number){
        if(!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        if(!protoManager.PlayerAction) return;

        const payload = { playerId,action,score,x };    
        const errMsg = protoManager.PlayerAction.verify(payload);
        if(errMsg){
            Logger.log("协议验证失败",errMsg);
            return;
        }
        const buffer = protoManager.PlayerAction.encode(payload).finish();
        if(buffer){
            this.ws.send(buffer);
            Logger.log("发送二进制数据：",payload);
        }
    }   
}
export const wsClient = new WsClient();