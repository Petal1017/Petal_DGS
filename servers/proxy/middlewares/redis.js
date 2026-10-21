const path = require("path");
const baseDir = path.join(__dirname,"../../../");

const redis = require("redis");
const {DATABASESCONF:{PROXY_REDIS}} = require(path.join(baseDir,"/config/constants"));

const redis_cli = redis.createClient({
    host:PROXY_REDIS.host,
    port:PROXY_REDIS.port,
    password:PROXY_REDIS.password
});

module.exports = function (){
    this.redis = redis_cli;
}