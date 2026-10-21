const {init:middleman_init} = require("./servers/middleman");
const {init:proxy_init} = require("./servers/proxy");
const {init:game_init} = require("./servers/game");
module.exports = {
	startServers(servers){
		if(servers.hasOwnProperty("middleman") && servers["middleman"]){
			let middleman = new middleman_init(servers["middleman"]);
		}
		if(servers.hasOwnProperty("proxy") && servers["proxy"]){
			let proxy = new proxy_init(servers["proxy"]);
		}
		if(servers.hasOwnProperty("game") && servers["game"]){
			for (let i of servers["game"]) {
				let game = new game_init(i);
			}
		}
	}
}