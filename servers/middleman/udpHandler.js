const path = require("path");
const baseDir = path.join(__dirname,"../../");
const serviceDir = path.join(baseDir,"/servers/middleman/services/");
const midwareDir = path.join(baseDir,"/servers/middleman/middlewares/");
const {isJSON} = require(path.join(baseDir,"/public/Tools"))

const {game,middleman} = require(path.join(baseDir,"/api/readServers"));

module.exports = function () {
    let udp = this;

    udp.on("message", (msg, rinfo) => {
        let address = rinfo.address,
            port = rinfo.port;
        msg = msg.toString();
        if(address != game[0].host || port != game[0].udpPort) return console.green("log:middleman-udp",`unexpected sender from ${address}:${port}`);
        if(!(msg = isJSON(msg))) return console.green("log:middleman-udp",`unexpected content type:${msg}`);
        if(msg['type'] == "conn-test"){
            console.green("got test msg from game,start to send test "+(new Date().getTime()-Number(msg['time']))+'ms');
            return conn_test();
        }
        console.green("log:middleman-udp",msg);
    });

    function conn_test(){
        udp.send(JSON.stringify({type:'conn-test',content:'middleman test',time:new Date().getTime()}),game[0].udpPort,game[0].host)
    }

}