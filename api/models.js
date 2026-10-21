const path = require("path");
const baseDir = path.join(__dirname,"../");
let {DATABASESCONF:{MYSQL},PROJECTMODE} = require(path.join(baseDir,"config/constants"));
const orm = require('orm');
MYSQL = MYSQL[PROJECTMODE];
module.exports = function() {
	this.use(orm.express(`mysql://${MYSQL.username}:${MYSQL.password}@${MYSQL.host}/${MYSQL.db}`, {
		define: function(db, models, next) {
			models.test = db.define("test", {
				id      : Number,
				name   	: String
			});
			models.users = db.define("users",{
				id      	: { type:"integer"},
				username   	: { type:"text",size:15},
				password	: { type:"text",size:20},
				email		: { type:"text",size:15},
				phone		: { type:"text",size:15},
				creat_time 	: { type: "date", time: false }
			});
			next();
		}
	}));
}
