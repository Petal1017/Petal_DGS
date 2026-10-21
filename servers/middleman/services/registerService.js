const path = require("path");
const baseDir = path.join(__dirname,"../../../");
const {checkLength} = require(path.join(baseDir,"/public/Tools"));

module.exports = function(req,res){
	const {un:username,pwd:password,em:email,ph:phone} = req.body;
	if(!username || !password || !email || !phone) return res.send('');
	if(!checkLength(username,6,15) || !checkLength(password,6,20) || !checkLength(email,6,20) || !checkLength(phone,6,15)) return res.send('');
	req.models.users.exists({username:username},function (err,rst) {
		if(err) return res.fail(0,"system error");
		if(rst === true) return res.fail(1,"username already exists");
		req.models.users.create({username,password,email,phone},function (err,rst) {
			if(err) return res.fail(2,"system error");
			if(rst == undefined) return res.fail(3,"failed");
			res.ok(0,"success");
		});
	})
}