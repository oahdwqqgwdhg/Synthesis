import { _decorator, Component, Node, EditBox } from 'cc';
import { Logger } from './Logger';
import { httpClient } from './HttpClient';
const { ccclass, property } = _decorator;

@ccclass('RegisterController')
export class RegisterController extends Component {

    @property({ type:EditBox })
    private Name: EditBox | null = null;

    @property({ type:EditBox })
    private Account: EditBox | null = null;

    @property({ type:EditBox }) 
    private Password: EditBox | null = null;

    @property({ type:Node })
    private login: Node | null =null;

    @property({ type:Node })
    private register : Node | null = null;

    private isRegister: boolean = false;

    async onRegister(){
        if(this.isRegister) return;
        if(!this.Name || !this.Account || !this.Password) return;
        const name = this.Name.string;
        const account = this.Account.string;
        const password = this.Password.string;
        this.isRegister = true;
        Logger.log(`玩家名:${name},账号${account},密码:${password}`);
        const result = await httpClient.register(name,account,password);
        if(result){
            Logger.log("注册成功");
            this.isRegister = false;
            this.register.active = false;
            this.login.active = true;
        }else{
            this.isRegister = false;
        }
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


