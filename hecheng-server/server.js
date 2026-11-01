const express = require('express');
const cors = require('cors');
const protobuf = require('protobufjs');
const app = express();
const mysql = require('mysql2');

app.use(cors());  //允许前端跨域请求----跨域(CORS)

app.use(express.json());  //解析前端发送过来的JSON数据

app.get('/',(req,res) => {
    res.send('服务器运行正常');
});

const palyerDB = new Map();
app.post('/register',(req,res)=>{
    const {name,account,password} = req.body;

    pool.execute('SELECT account From players WHERE account = ?',[account],(err,results) => {
        if(err) return res.json({code:500,msg:'数据库错误'});
        if(results.length > 0) return res.json({code:400,msg:'账号已存在'});

        pool.execute('INSERT INTO players (account,name,password,highScore) VALUES (?,?,?,0)',[account,name,password],(err) => {
        if(err) return res.json({code:500,msg:'注册失败'});
        res.json({code:200,msg:'注册成功'});
    })
    })

   
    // if(palyerDB.has(account)){
    //     res.json({
    //         code:400,
    //         msg:"账号已经存在"
    //     });
    //     return;
    // }
    // palyerDB.set(account,{name,password,highScore: 0});
    // res.json({
    //     code:200,
    //     msg:"注册成功",
    // });
})
app.post('/login',(req,res) => {
    const { account, password } = req.body;
    console.log(`收到登录请求：${account},${password}`);

    pool.execute('SELECT account,name,password,highScore FROM players WHERE account = ?',[account], (err,results) => {
        if(err) return res.json({code:500,msg:'数据库错误'});
        if(results.length === 0) return res.json({code:400,msg:'账号不存在'});
        const player = results[0];
        if(player.password !== password) return res.json({code:401,msg:'密码不正确'});

        res.json({
            code:200,
            data:{
                token:`player_${account}`,
                highScore:player.highScore,
                name:player.name
            }
        })
    })

    // const act = palyerDB.get(account);
    // if(!act){
    //     res.json({ code: 400,msg: "账号不存在"});
    //     return;
    // }
    // if(act.password === password){
    //     res.json({
    //         code:200,
    //         msg:"登陆成功",
    //         data:{
    //             token:`player_${account}`,
    //             highScore: act.highScore,
    //             name:act.name,
    //         }
    //     });
    // }else{
    //     res.json({ code: 401,msg: "密码不正确"})
    // }
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

app.get('/leaderboard',(req,res)=>{

    pool.execute('SELECT name,highScore AS score FROM players ORDER BY highScore DESC LIMIT 10', (err,results) => {
        if(err) return res.json({code: 500, msg:'获取失败'});
        res.json({code:200,data: results});
    });
    // const list = Array.from(palyerDB.values())
    //     .map(p => ({name:p.name,score:p.highScore}))
    //     .sort((a,b) => b.score - a.score)
    //     .slice(0,10);

    // res.json({code:200,msg:"获取成功",data:list});
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

        try{
            const jsonMsg = JSON.parse(buffer.toString());

            if(jsonMsg.type === 'updateScore'){
                const {account,name,score} = jsonMsg;

                pool.execute('UPDATE players SET highScore = ? WHERE account = ? AND highScore < ?',[score,account,score],(err,result) => {
                    if(err) return console.log("分数更新失败",err);

                    pool.query('SELECT name,highScore AS score FROM players ORDER BY highScore DESC LIMIT 10',(err,row)=>{
                        if(err) return;
                        const outMsg = JSON.stringify({type:'leaderboard',data:row});

                        wss.clients.forEach((client) => {
                            if(client.readyState === WebSocket.OPEN){
                                client.send(outMsg);    
                            }
                        });
                    })
                })
                // const player = palyerDB.get(account);
                // if(!player){
                //     console.log("未找到玩家");
                //     return; 
                // }
                // if(player && score > player.highScore){
                //     player.highScore = score;
                //     console.log(`玩家${name}刷新最高分为${score}`);
                // }

                // const top10 = Array.from(palyerDB.values())
                //     .map(p => ({name:p.name,score:p.highScore}))
                //     .sort((a,b)=> b.score - a.score)
                //     .slice(0,10);

                // const outMsg = JSON.stringify({ type: 'leaderboard',data:top10 });
                // wss.clients.forEach((client)=>{
                //     if(client.readyState === WebSocket.OPEN){
                //         client.send(outMsg);
                //     }
                // });

                return;
            }   
        }catch(e){

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

const pool = mysql.createPool({
    host:'127.0.0.1',
    port:3306,
    user:'qqqq',
    password:'123456',
    database:'hecheng_game',
    waitForConnections:true,
    connectionLimit:10
})

pool.query(`
    CREATE TABLE IF NOT EXISTS players(
        account VARCHAR(50) PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        password VARCHAR(100) NOT NULL,
        highScore INT DEFAULT 0
    )
    `,(err) => {
    if(err) console.log("建表失败：",err);
    else console.log('players表已就绪');
});



