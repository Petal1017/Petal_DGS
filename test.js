// udp链接测试
const dgram = require("dgram");

const server = dgram.createSocket("udp4");

server.on("message", (msg, rinfo) => {
    console.log("rinfo.address =  " + rinfo.address);
    console.log("rinfo.port =  " + rinfo.port);
    console.log(msg.toString());
});

server.on("listening", () => {
    console.log("address:" + server.address().address);
    console.log("port:" + server.address().port);
});

server.bind("41234");