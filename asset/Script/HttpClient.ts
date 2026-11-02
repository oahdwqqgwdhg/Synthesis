import { Logger } from "./Logger";
import { playerData } from "./PlayerData";

class HttpClient{
    private baseUrl: string = 'http://localhost:3000';

    private _token: string = '';

    private request(url:string,method:string,body?:any,token?:string):Promise<any>{
        return new Promise((resolve,reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method,url,true);
            xhr.setRequestHeader('Content-Type','application/json');
            if (token) {
                xhr.setRequestHeader('Authorization', token);
            }
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        // 判断一下 responseText 是否为空
                        const text = xhr.responseText;
                        resolve(text ? JSON.parse(text) : null);
                    } catch (e) {
                        reject(new Error("解析 JSON 失败: " + xhr.responseText));
                    }
                } else {
                    reject(new Error(`HTTP Error: ${xhr.status}`));
                }
            }
            };
            xhr.onerror = (err) => reject(err);
            xhr.send(body ? JSON.stringify(body):null);
        })
    }

    public async register(name:string,account:string,password:string):Promise<boolean>{
        try{
            // const res = await fetch(`${this.baseUrl}/register`,{
            //     method:'POST',
            //     headers:{ 'Content-Type':'application/json'},
            //     body:JSON.stringify({name,account,password})
            // })
            // const data =await res.json();

            const data = await this.request(`${this.baseUrl}/register`,'POST',{name,account,password});
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
            // const res = await fetch(`${this.baseUrl}/login`,{
            //     method:'POST',
            //     headers: { 'Content-Type': 'application/json'},
            //     body:JSON.stringify({account,password})
            // });
        
            // const data = await res.json();

            const data = await this.request(`${this.baseUrl}/login`,'POST',{account,password});
            Logger.log("登录成功,返回数据为：",data);
            if(data.code === 200){
                this._token = data.data.token;
                // window['currentAccount'] = account;
                // window['currentName'] = data.data.name;
                playerData.setData(account,data.data.name);
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
            // const res = await fetch(`${this.baseUrl}/getData`,{
            //     method:'get',
            //     headers:{ 'Authorization': this._token}
            // });
            // const data = await res.json();

            const data = await this.request(`${this.baseUrl}/getData`,'get',null,this._token);
            Logger.log("获取成功,返回数据为：",data);
            if(data.code === 200){
                Logger.log("获取最高分成功，最高分列表：",data.data.highScore);
            }
        }catch(e){
            Logger.error("请求失败，",e)
        }
    }

    public async getLeaderboard():Promise<{name:string,score:number}[]>{
        try{
            // const res = await fetch(`${this.baseUrl}/leaderboard`,{
            //     method: 'GET',
            // });

            // const data = await res.json();

            const data = await this.request(`${this.baseUrl}/leaderboard`,'GET');
            if(data.code === 200){
                return data.data;
            }
        }catch(e){  
            Logger.log("获取失败",e);
        }
        return [];
    }
    
}

export const httpClient = new HttpClient();