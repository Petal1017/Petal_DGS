var express = require('express');
const path = require("path");
const baseDir = path.join(__dirname,"../../");
const {FILEPATH,PROJECTMODE} = require(baseDir+"/config/constants");
const httpHandler = require(baseDir+FILEPATH.MIDDLEMANHANDLER.HTTPHANDLER);
const ioHandler = require(baseDir+FILEPATH.MIDDLEMANHANDLER.IOHANDLER);
const udpHandler = require(baseDir+FILEPATH.MIDDLEMANHANDLER.UDPHANDLER);
let Middleman = {};
Middleman.init = function init({id,host,clientPort,udpPort}){
	this.app = express();
	this.id = id;
	this.host = host;
	this.port = clientPort;
	this.server = require('http').Server(this.app);
	this.io = require('socket.io')(this.server, {cors: true});
	this.udp = require("dgram").createSocket("udp4");
	this.udp.io = this.io;
	this.udp.bind(udpPort);
	httpHandler.call(this.app);
	ioHandler.call(this.io);
	udpHandler.call(this.udp);

	this.udp.on("listening", () => {
		console.green(`Middleman\tudp\tlistening on ${host}:${udpPort}`);
	});
	this.server.listen(this.port,function(){
		console.green(`Middleman\t${id}\tlistening on ${host}:${clientPort}`);
	});
}


module.exports = Middleman;

