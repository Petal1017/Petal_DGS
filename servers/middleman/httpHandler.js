const path = require("path");
const baseDir = path.join(__dirname,"../../");
const serviceDir = path.join(baseDir,"/servers/middleman/services/");
const midwareDir = path.join(baseDir,"/servers/middleman/middlewares/");

const ejs = require("ejs");
const express = require("express");
const bodyParser = require('body-parser');
const session = require("express-session");
const models = require(path.join(baseDir,"/api/models"));
const loginSrv = require(path.join(serviceDir,"/loginService.js"));
const registerSrv = require(path.join(serviceDir,"/registerService.js"));
const logoutSrv = require(path.join(serviceDir,"/logoutService.js"));

const loginStatusMidware = require(path.join(midwareDir,"/loginStatusCheck.js"));
const resFormatMidware = require(path.join(midwareDir,"/responseFormat.js"));
const redisCliMidware = require(path.join(midwareDir,"/redisClient.js"));
const wListMidware = require(path.join(midwareDir,"/whiteList.js"));

const {FILEPATH:{VIEWPATH},AESKEY} = require(path.join(baseDir,"/config/constants"));
const Tools = require(path.join(baseDir,"/public/Tools"));

module.exports = function(){
	const viewsDir = path.join(baseDir,VIEWPATH);
	let app = this;

	app.use(session({
		secret: 'petaldgs',
		resave: false,
		saveUninitialized: true
	}))
	app.use(bodyParser.urlencoded({extended:false}));
	app.use(bodyParser.json())
	app.use('/static',express.static(path.join(baseDir, 'client/static')));
	app.set('view engine', 'ejs');
	app.engine('html',ejs.__express);
	app.set('views', viewsDir);

	// models register
	models.call(app);

	// middlewares register
	app.use(wListMidware);
	app.use(resFormatMidware);
	app.use(redisCliMidware);


	app.use(loginStatusMidware);


	// api register
	app.get("/",function(req,res){
		res.render('client', {foo: 'FOO'});
	});
	app.get("/register",function(req,res){
		res.render('register', {foo: 'FOO'});
	});
	
	
	app.post("/login",loginSrv);
	
	app.get("/logout",logoutSrv);

	app.post("/register",registerSrv);

	app.get("/rooms",function (req,res){
		res.render('rooms', {userinfo: req.session.userinfo,aes_key:AESKEY});
	});

	app.get("/test",function (req,res){
		let con = Tools.aesEncrypt("1234567");
		console.green(con);
		console.green(Tools.aesDecrypt(con));
	});
	
	
}