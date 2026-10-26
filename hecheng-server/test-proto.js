const protobuf = require('protobufjs');

protobuf.load("message.proto",(err,root) => {
    if(err) throw err;

    const PlayerAction = root.lookupType("PlayerAction");
    const payload = { playerId: "player_001", action: "drop", score: 10,x: 120.5};

    const errMsg = PlayerAction.verify(payload);
    if(errMsg) throw Error(errMsg);


    const buffer = PlayerAction.encode(payload).finish();
    console.log("编码后的二进制乱码:",buffer);
    console.log("JSON字符串长度：",JSON.stringify(payload).length);
    console.log("protobuf二进制长度：",buffer.length,"字节");

    const decode = PlayerAction.decode(buffer);
    console.log("解码后的长度：",decode.length);
    console.log("解码后的数据：",decode);
});