const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());  //允许前端跨域请求----跨域(CORS)

app.use(express.json());  //解析前端发送过来的JSON数据

app.get('/',(req,res) => {
    res.send('服务器运行正常');
});

app.post('/login',(req,res) => {
    const { username, password } = req.body;
    console.log(`收到登录请求：${username},${password}`);

    if(username && password){
        res.json({
            code:200,
            msg:"登陆成功",
            data:{
                token:"1234567890asd",
                highScore: 9999
            }
        });
    }else{
        res.json({ code: 400,msg: "账号密码不能为空"})
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

wss.on('connection',(ws) =>{
    console.log("有一个客户连接上了WebSocket！");

    ws.on('message',(message)=>{
        console.log("收到客户端消息：",message.toString());

        wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN){
                client.send(`服务器收到了${message}`);
            }
        });
    });

    
    ws.on('close',() => {
        console.log('一个客户端断开了');
    });
});



