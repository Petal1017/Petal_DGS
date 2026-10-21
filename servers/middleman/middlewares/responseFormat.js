module.exports = function (req,res,next) {
    res.ok = function (code,msg,data={}){
        res.send({
            status:"ok",
            code:code,
            msg:msg,
            data:data
        });
    }
    res.fail = function (code,msg,data={}){
        res.send({
            status:"fail",
            code:code,
            msg:msg,
            data:data
        });
    }
    res.error = function (code,msg,data={}){
        res.send({
            status:"fail",
            code:code,
            msg:msg,
            data:data
        });
    }

    next();
}