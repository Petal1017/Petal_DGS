const path = require("path");
const baseDir = path.join(__dirname,"../../");
const proxyDir = path.join(baseDir,"/servers/proxy");

const httpHandler = require(path.join(proxyDir,"httpHandler"));
const proxyHandler = require(path.join(proxyDir,"proxyHandler"));
const ioProxyHandler = require(path.join(proxyDir,"ioProxyHandler"));

let Proxy = {};
Proxy.init = function ({id,host,port,proxyPort}) {
    this.app = require("express")();
    this.proxy = require('http-proxy').createProxyServer();
    this.server = require('http').Server(this.app);
    this.io = require('socket.io')(this.server, {cors: true});
    httpHandler.call(this.app,this.proxy);
    ioProxyHandler.call(this.io);
    proxyHandler.call(this.proxy);
    this.server.listen(port, function () {
        console.blue('Proxy\t'+id+'\t\tlistening on '+host+':'+ port);
    });
}

module.exports = Proxy;