const path = require("path");
const baseDir = path.join(__dirname,"../../../");
const middlemanDir = path.join(baseDir,"/servers/middleman");

const Redis = require(path.join(middlemanDir,"/api/redisConnector"));

module.exports = function (req,res,next){
    if(next){
        req.redis = Redis;
        next();
    }else{
        this.redis = Redis;
    }
}