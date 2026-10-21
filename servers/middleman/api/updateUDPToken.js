const path = require("path");
const baseDir = path.join(__dirname,"../../../");

const { v4: getUUID } = require('uuid');

module.exports = function (delay,redis,client) {
    // console.log(1)

    function update() {
        let token = getUUID();
        redis.set("udptoken",token);
        client.emit("newudptoken",token);
    }
    update();
    return setInterval(update,delay);
    // set token
}