import { Logger } from "./Logger";

class HttpClient{
    private baseUrl: string = 'http://localhost:3000';

    private _token: string = '';

    public async register(name:string,account:string,password:string):Promise<boolean>{
        try{
            const res = await fetch(`${this.baseUrl}/register`,{
                method:'POST',
                headers:{ 'Content-Type':'application/json'},
                body:JSON.stringify({name,account,password})
            })
            const data =await res.json();
            Logger.log("注册成功，并返回数据",data);
            if(data.code === 200){
                return true;
            }
            return false;
        }catch(e){
            Logger.error("请求失败",e);
            return false;
        }
    }

    public async login(account: string, password: string):Promise<boolean>{
        try{
            const res = await fetch(`${this.baseUrl}/login`,{
                method:'POST',
                headers: { 'Content-Type': 'application/json'},
                body:JSON.stringify({account,password})
            });
        
            const data = await res.json();
            Logger.log("登录成功,返回数据为：",data);
            if(data.code === 200){
                this._token = data.data.token;
                return true;
            }
            return false;
        }catch(e){
            Logger.error("请求失败",e);
            return false;
        }
    }

    public async getData(){
        try{
            const res = await fetch(`${this.baseUrl}/getData`,{
                method:'get',
                headers:{ 'Authorization': this._token}
            });
            const data = await res.json();
            Logger.log("获取成功,返回数据为：",data);
            if(data.code === 200){
                Logger.log("获取最高分成功，最高分列表：",data.data.highScore);
            }
        }catch(e){
            Logger.error("请求失败，",e)
        }
    }
    
}

export const httpClient = new HttpClient();