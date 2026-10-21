var express = require('express');
const path = require("path");
const baseDir = path.join(__dirname,"../../");
const gameDir = path.join(baseDir,"/servers/game/");
const {FILEPATH,PROJECTMODE} = require(baseDir+"/config/constants");
const httpHandler = require(baseDir+FILEPATH.GAMEHANDLER.HTTPHANDLER);
const gameHandler = require(path.join(gameDir,"/gameHandler"));
const udpHandler = require(path.join(gameDir,"/udpHandler"));
let Game = {};
Game.init = function init({id,host,clientPort,udpPort}){
    this.app = express();
    this.id = id;
    this.host = host;
    this.port = clientPort;
    this.server = require('http').Server(this.app);
    this.io = require('socket.io')(this.server, {cors: true});
    this.udp = require("dgram").createSocket("udp4");
    this.udp.bind(udpPort);
    httpHandler.call(this.app);
    gameHandler.call(this.io);
    udpHandler.call(this.udp);
    this.udp.on("listening", () => {
        console.yellow(`Game\tudp\tlistening on ${host}:${udpPort}`);
    });
    this.server.listen(this.port,function(){
        console.yellow(`Game\t${id}\t\tlistening on ${host}:${clientPort}`);
    });
}


module.exports = Game;

