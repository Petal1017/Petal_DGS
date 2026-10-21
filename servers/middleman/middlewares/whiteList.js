const path = require("path");
const baseDir = path.join(__dirname,"../../../");

const {ACCESS_CHECK} = require(path.join(baseDir,"/config/constants"));

module.exports = function (req,res,next) {
    if(req.headers.access_check != ACCESS_CHECK) return res.status(403).end();
    next();
}