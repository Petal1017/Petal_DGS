const path = require("path");
const baseDir = path.join(__dirname,"../../");

const {ACCESS_CHECK} = require(path.join(baseDir,"/config/constants"));
const {middleman} = require(path.join(baseDir,"/api/readServers"));

module.exports = function (proxy) {
    let app = this;
    app.use(function (req,res) {
        req.headers.access_check = ACCESS_CHECK;
        proxy.web(req, res, {
            // 目标地址
            target: "http://"+middleman.host+":"+middleman.clientPort
        });
    })

}