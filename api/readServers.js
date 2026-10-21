const path = require("path");
const baseDir = path.join(__dirname,"../");

const fs = require("fs");
const {FILEPATH,PROJECTMODE} = require("../config/constants");
const {isJSON} = require(path.join(baseDir,FILEPATH.TOOL));


const server_content = fs.readFileSync(path.join(baseDir,FILEPATH.SERVER)).toString("utf-8");
let servers;
if(!(servers = isJSON(server_content))) throw new TypeError("/config/servers.json is invalid");
servers = servers[PROJECTMODE];
module.exports = servers;
