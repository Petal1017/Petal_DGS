const path = require("path");
const baseDir = path.join(__dirname,"../../");
const {PROXYAUTHKEY} = require(path.join(baseDir,"/config/constants"));
const {proxy:{id:proxy_id}} = require(path.join(baseDir,"/api/readServers"));
const redisMidware = require(path.join(baseDir,"/servers/proxy/middlewares/redis"));

const io_cli = require("socket.io-client");

module.exports = function () {
    let io = this;
    io.clientPool = {};
    io.roomPool = {};
    io.connector = io_cli("ws://127.0.0.1:3014",{query:{identity:PROXYAUTHKEY,username:proxy_id}});
    io.connector.prependAny((eventName, args) => {
        if( /^single_\S+/.test(eventName) ) return io.clientPool[eventName].emit(eventName,args);
        for(let i in io.clientPool){
            io.clientPool[i].emit(eventName, args);
        }
    });
    io.connector.on("newudptoken",function(res){
        io.updtoken=res;
    })
    redisMidware.call(io);
    io.on("connection",function(client){
        console.blue("log:proxy	user: '"+client.handshake.query.username + "' connected");
        client.username = client.handshake.query.username;
        client.uuid = client.handshake.query.uuid;
        io.clientPool[client.handshake.query.username] = client;
        client.emit("newudptoken",io.updtoken);
        client.onAny((eventName, ...args) => {
            io.connector.emit(eventName,...args);
        });
        client.on("disconnect",function () {
            if(client.roomid) delete io.roomPool[client.roomid][client.username];
            for(let i in io.roomPool[client.roomid]){
                if(i != client.username) io.roomPool[client.roomid][i].emit("useroff",client.username);
            }
            console.yellow("log:proxy	user: '"+client.username + "' disconnected");
        });
        client.on("login",function(un,uuid){
            if(client.username != un) return io.emit("logininfo","connect failed");;
            io.redis.hmget("users",un,function (err,res) {
                if(uuid == res){
                    console.yellow(un+" login");
                    let obj = {};
                    for (let i in io.roomPool) {
                        console.log(i)
                        obj[i]={};
                        for(let j in io.roomPool[i]){
                            obj[i][j] = {};
                            obj[i][j]['shape'] = io.roomPool[i][j]['shape'];
                            obj[i][j]['color'] = io.roomPool[i][j]['color'];
                        }
                    }
                    return client.emit("logininfo","success",obj);
                }else{
                    client.emit("logininfo","connect failed");
                }
            })
        });
        client.on("pos",function (res) {
            //console.log("--------------",client.inRoom,client.roomid);
            let roomid = res.room,
                username = res.username;
            //if(!io.roomPool.hasOwnProperty(roomid) || !io.roomPool[roomid].hasOwnProperty(username)) return;
            for (let i in io.roomPool[roomid]) {
                if(i==username) continue;
                io.roomPool[roomid][i].emit("refresh",res);
            }

        });
        client.on("throwball",function (un,playerDir,playerColl) {
            console.log(client.roomid)
            for (let i in io.roomPool[client.roomid]) {
                if(i != un) io.roomPool[client.roomid][i].emit("userthrow",un,playerDir,playerColl);
            }
        })
        client.on("enterroom",function (res,shape,color) {
            if(res == null) res = Object.keys(io.roomPool).length+1;
            if(!io.roomPool.hasOwnProperty(res)) io.roomPool[res]={};
            io.roomPool[res][client.username] = client;
            console.yellow(client.username+" entered room "+res);
            io.roomPool[res][client.username].inRoom = true;
            io.roomPool[res][client.username].roomid = res;
            io.roomPool[res][client.username]['shape'] = shape;
            io.roomPool[res][client.username]['color'] = color;
            let obj = [];
            for(let i in io.roomPool[res]){
                obj.push([i,io.roomPool[res][i].shape,io.roomPool[res][i].color]);
            }
            // console.log(obj);
            for(let i in io.roomPool[res]){
                io.roomPool[res][i].emit("roominfo",obj,res);
            }

            obj = {};
            for (let i in io.roomPool) {
                obj[i]={};
                for(let j in io.roomPool[i]){
                    obj[i][j] = {};
                    obj[i][j]['shape'] = io.roomPool[i][j]['shape'];
                    obj[i][j]['color'] = io.roomPool[i][j]['color'];
                }
            }
            return client.emit("logininfo","success",obj);
        });
        client.on("roomchat",function (res){
            console.yellow("roomchat from "+res.username+" content "+res.con,res.color,res.room);
            if(res.room && io.roomPool.hasOwnProperty(res.room)){
                for(let i in io.roomPool[res.room]){
                    io.roomPool[res.room][i].emit("chatcontent",{username:res.username,color:res.color,con:res.con});
                }
            }
        })
    });
}