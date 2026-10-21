const path = require("path");
const baseDir = path.join(__dirname,"../../");

const {isJSON} = require(path.join(baseDir,"/public/Tools"))

const {middleman,game} = require(path.join(baseDir,"/api/readServers"));

module.exports = function () {
    let udp = this;

    udp.on("message", (msg, rinfo) => {
        let address = rinfo.address,
            port = rinfo.port;
        msg = msg.toString();
        if(address != middleman.host || port != middleman.udpPort) return console.yellow(`unexpected sender from ${address}:${port}`);
        if(!(msg = isJSON(msg))) return console.yellow("log:middleman-udp",`unexpected content type:${msg}`);
        if(msg['type'] == "conn-test"){
            return console.yellow("got the test from middleman ,connection created "+(new Date().getTime()-Number(msg['time']))+'ms')
        }
        console.yellow(msg);

    });
    udp.send(JSON.stringify({type:'conn-test',content:'game test',time:new Date().getTime()}),middleman.udpPort,middleman.host);
}