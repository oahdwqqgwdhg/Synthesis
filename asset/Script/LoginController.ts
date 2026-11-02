import { _decorator, director, Component, Node, EditBox, Button } from 'cc';
import { Logger } from './Logger';
import { httpClient } from './HttpClient';
import { scoreManager } from './ScoreManager';
const { ccclass, property } = _decorator;

@ccclass('LoginController')
export class LoginController extends Component {
    @property({ type:EditBox })
    private Account: EditBox | null = null;

    @property({ type:EditBox }) 
    private Password: EditBox | null = null;

    @property({ type:Node })
    private login: Node | null =null;

    @property({ type:Node })
    private register : Node | null = null;

    private isLogin: boolean = false;

    async onLogin(){
        if(this.isLogin) return;
        if(!this.Account || !this.Password) return;
        const account = this.Account.string;
        const password = this.Password.string;
        this.isLogin = true;
        Logger.log(`账号:${account},密码${password}`);
        const canlogin =await httpClient.login(account,password);
        if(canlogin){

            // const serverHigh = await httpClient.getHighScore(); // 你得加一个 getHighScore 方法
            // if(serverHigh > 0){
            //     scoreManager.initFromServer(serverHigh); // 需要加一个方法
            // }
            director.loadScene('main',(err : Error) => {
                if(err){
                    this.isLogin = false;
                    Logger.log("加载main场景失败",err);
                }else{
                    Logger.log("加载main场景成功");
                }
            });
        }else{
            this.isLogin = false;
        }
       
    }

    onRegister(){
        this.login.active = false;
        this.register.active = true;
    }

    start() {
        Logger.setDebug(true);
    }

    update(deltaTime: number) {
        
    }
}


