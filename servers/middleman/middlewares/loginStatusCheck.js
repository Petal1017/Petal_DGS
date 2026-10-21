const path = require("path");
const baseDir = path.join(__dirname,"../../../");

const {isJSON} = require(path.join(baseDir,"/public/Tools"));

module.exports = function (req,res,next){
    let userinfo;
    if(!req.session.userinfo || !(userinfo = isJSON(req.session.userinfo))){
        if(req.path == '/' || req.path == '/test' || req.path == '/register' || (req.path == '/login' && req.method.toLowerCase() == 'post')) return next();
        return res.redirect("/");
    }
    next();
}