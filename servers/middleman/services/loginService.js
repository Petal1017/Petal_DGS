const path = require("path");
const baseDir = path.join(__dirname,"../../../");

const { v4: getUUID } = require('uuid');

module.exports = function(req,res){
	const {un:username,pwd:password} = req.body;
	if(!username || !password) return res.send('');
	req.models.users.find({username:username},function (err,rst){
		if(err) return res.fail(0,"system error");
		if(!Array.isArray(rst) || res.length == 0) return res.fail(1,"invalid username");
		if(rst[0]['password'] != password) return res.fail(1,"password error");
		const uuid = getUUID();
		req.redis.hmset("users",username,uuid,function (err,rst) {
			if(err) return res.fail(0,"system error");
			req.session.userinfo = JSON.stringify({username:username,time:new Date().getTime(),uuid:uuid});
			res.ok(0,"success");
		})
	});
}