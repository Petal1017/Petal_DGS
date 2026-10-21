const configs = require("./api/readServers");
const startServers = require("./api/startServers").startServers;
global.console.yellow = function (...args) {
    return console.log('\033[40;33m',...args,' \033[0m');
}
global.console.green = function (...args) {
    return console.log('\033[40;32m',...args,' \033[0m');
}
global.console.blue = function (...args) {
    return console.log('\033[40;34m',...args,' \033[0m');
}
startServers(configs);