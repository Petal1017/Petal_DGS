const path = require("path");
const baseDir = path.join(__dirname,"../../../");

module.exports = function (req,res) {
    if(req.session.userinfo) delete req.session.userinfo;
    res.redirect("/");
}