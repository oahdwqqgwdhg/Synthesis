const express = require('express');
const cors = require('cors');
const protobuf = require('protobufjs');
const app = express();

app.use(cors());  //允许前端跨域请求----跨域(CORS)

app.use(express.json());  //解析前端发送过来的JSON数据

app.get('/',(req,res) => {
    res.send('服务器运行正常');
});

const palyerRankDB = new Map();
app.post('/register',(req,res)=>{
    const {name,account,password} = req.body;
    if(palyerRankDB.has(account)){
        res.json({
            code:400,
            msg:"账号已经存在"
        });
        return;
    }
    palyerRankDB.set(account,{name,password});
    res.json({
        code:200,
        msg:"注册成功",
    });
})
app.post('/login',(req,res) => {
    const { account, password } = req.body;
    console.log(`收到登录请求：${account},${password}`);
    const act = palyerRankDB.get(account);
    if(!act){
        res.json({ code: 400,msg: "账号不存在"});
        return;
    }
    if(act.password === password){
        res.json({
            code:200,
            msg:"登陆成功",
            data:{
                token:`player_${account}`,
                highScore: 9999
            }
        });
    }else{
        res.json({ code: 401,msg: "密码不正确"})
    }
});

app.get('/getData',(req,res) => {
    const token = req.headers.authorization;

    if(token){
        res.json({
            code:200,
            msg:"获取成功",
            data:{highScore: 8888},
        })
    }else{
        res.json({ code: 400,msg: "身份验证失败,token无效"});
    }
});

app.listen(3000,()=>{
    console.log('后端服务器已启动: http://localhost:3000');
})

const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080});
let PlayerAction;
protobuf.load("message.proto",(err,root) => {
    if(err) throw err;
    PlayerAction = root.lookupType("PlayerAction");
})

wss.on('connection',(ws) =>{
    console.log("有一个客户连接上了WebSocket！");

    ws.isAlive = true;

    ws.on('pong',() => {
        ws.isAlive = true;
    });

    ws.on('message',(buffer)=>{
        if(buffer.toString() === 'ping'){
            ws.send('pong');
            return;
        }
        if(!PlayerAction) return;
        try{
            // console.log("收到客户端消息：",buffer.toString());
            const decode = PlayerAction.decode(buffer);
            console.log("收到并解析玩家动作：",decode);

            const outProtoBuf = PlayerAction.encode(decode).finish();

            wss.clients.forEach((client) => {
                if(client.readyState === WebSocket.OPEN){
                    client.send(outProtoBuf);
                }
            });
        }catch(e){
            console.log("解析失败",e);
        }
        
    });

    
    ws.on('close',() => {
        console.log('一个客户端断开了');
    });
});

setInterval(() => {
    wss.clients.forEach((ws) => {
        if(ws.isAlive === false){
            console.log('发现死连接，主动断开');
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    });
},5000 );



