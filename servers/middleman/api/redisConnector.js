const path = require("path");
const baseDir = path.join(__dirname,"../../../");

const redis = require("redis");
const {DATABASESCONF:{MIDDLEMAN_REDIS}} = require(path.join(baseDir,"/config/constants"));



class Redis {
    //单例
    static getInstance() {
        if (!Redis.instance) {

            Redis.instance = new Redis();
        }

        return Redis.instance;
    }
    constructor() {
        const redis_cli = redis.createClient({
            host:MIDDLEMAN_REDIS.host,
            port:MIDDLEMAN_REDIS.port,
            password:MIDDLEMAN_REDIS.password
        });

        this.redis = redis_cli;
    }
}
module.exports = Redis.getInstance().redis;