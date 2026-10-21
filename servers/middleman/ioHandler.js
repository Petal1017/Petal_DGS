const path = require("path");
const baseDir = path.join(__dirname,"../../");
const middlemanDir = path.join(baseDir,"/servers/middleman");

const {PROXYAUTHKEY,UDPTOKENREFRESH} = require(path.join(baseDir,"/config/constants"));
const redisMidware = require(path.join(middlemanDir,"/middlewares/redisClient"));
const updateUDPToken = require(path.join(middlemanDir,"/api/updateUDPToken"));

module.exports = function(){
	let io = this;
	redisMidware.call(io);

	io.on("connection",function(client){
		if(client.handshake.query.identity && client.handshake.query.identity == PROXYAUTHKEY){
			console.green("log:middleman proxy-connect from: '"+client.handshake.query.username + "' connected");
			io.proxyClient = client;
			client.on("msg",function(msg){
				console.green("msg:middleman proxy-msg from: '"+client.handshake.query.username + "' content:"+msg)

			});
			updateUDPToken(UDPTOKENREFRESH,io.redis,client);
		}else{
			return console.green("log:middleman unknow connector, connection denied");
			// console.green("log:middleman user-connect from: '"+client.handshake.query.username + "' connected");
			// client.on("msg",function(msg){
			// 	console.green("msg:middleman user-msg from: '"+client.handshake.query.username + "' content:"+msg)
			// });
		}
	});
	
}