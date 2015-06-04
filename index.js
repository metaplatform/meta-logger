/*
 * Logger / metaPlatform
 *
 * @author Jiri Hybek <jiri.hybek@cryonix.cz> / Cryonix Innovations <www.cryonix.cz>
 * See LICENSE file distributed with this source code for licensing info
 */

var colors = require("colors");
var util = require("util");
var fs = require("fs");

/**
 * Logger object
 */
var Logger = {

	levels: {
		debug: 	3,
		info: 	2,
		warn: 	1,
		error: 	0
	},

	targets: {},

	_log: function(level, facility, args){

		for(var i in Logger.targets)
			Logger.targets[i].log(level, facility, args);

	},

	log: function(){

		var args = Array.prototype.slice.call(arguments);
		var level = args.shift();

		Logger._log(level, null, args);

	},

	debug: function(){

		Logger._log("debug", null, Array.prototype.slice.call(arguments));

	},

	info: function(){

		Logger._log("info", null, Array.prototype.slice.call(arguments));

	},

	warn: function(){

		Logger._log("warn", null, Array.prototype.slice.call(arguments));

	},

	error: function(){

		Logger._log("error", null, Array.prototype.slice.call(arguments));

	},

	facility: function(name){

		return {

			log: function(){

				var args = Array.prototype.slice.call(arguments);
				var level = args.shift();

				Logger._log(level, name, args);

			},

			debug: function(){
				Logger._log("debug", name, Array.prototype.slice.call(arguments));
			},

			info: function(){
				Logger._log("info", name, Array.prototype.slice.call(arguments));
			},

			warn: function(){
				Logger._log("warn", name, Array.prototype.slice.call(arguments));
			},

			error: function(){
				Logger._log("error", name, Array.prototype.slice.call(arguments));
			}

		};

	},

	to: function(name, targetObject){

		Logger.targets[name] = targetObject;
		return Logger;

	},

	toConsole: function(options){

		Logger.targets["console"] = new Logger.ConsoleTarget(options);
		return Logger;

	},

	toFile: function(filename, options){

		Logger.targets[filename] = new Logger.FileTarget(filename, options);
		return Logger;

	},

	toJsonFile: function(filename, options){

		Logger.targets[filename] = new Logger.JsonFileTarget(filename, options);
		return Logger;

	}

};

/**
 * Base logger
 */
Logger.BaseTarget = function(options){

	options = options || {};

	this.level = options.level || "info";
	this.timestamp = options.timestamp || false;

};

Logger.BaseTarget.prototype.log = function(level, facility, args){

	if(Logger.levels[level] > Logger.levels[this.level]) return;

	var msg = [util.format.apply(this, args)];

	//Add facility
	if(facility)
		msg.unshift("[" + facility + "]");

	//Add level
	msg.unshift(level + ":");

	//Add timestamp
	if(this.timestamp){
		
		var t = new Date();
		
		msg.unshift(util.format("%s-%s-%s %s:%s:%s",
			t.getFullYear(),
			("0" + (t.getMonth() + 1)).substr(-2),
			("0" + (t.getDate() + 1)).substr(-2),
			("0" + t.getHours()).substr(-2),
			("0" + t.getMinutes()).substr(-2),
			("0" + t.getSeconds()).substr(-2)
		));

	}

	return this.write(level, facility, msg);

};

Logger.BaseTarget.prototype.write = function(level, facility, msg){
	
	return;

}

/**
 * Console logger
 */
Logger.ConsoleTarget = function(options){

	options = options || {};

	//call super
	Logger.BaseTarget.call(this, options);

	this.colorize = ( options.colorize !== undefined ? options.colorize : true );

	//Colors
	if(options.colors)
		this.colors = options.colors;
	else
		this.colors = {
			debug: 	colors.cyan,
			info: 	colors.white,
			warn: 	colors.yellow,
			error: 	colors.red
		}

};

util.inherits(Logger.ConsoleTarget, Logger.BaseTarget);

Logger.ConsoleTarget.prototype.write = function(level, facility, msg){

	if(this.colorize && this.colors[level])
		console.log(this.colors[level](msg.join(" ")));
	else
		console.log(msg.join(" "));

};

/**
 * File logger
 */
Logger.FileTarget = function(filename, options){

	options = options || {};

	//call super
	Logger.BaseTarget.call(this, options);

	//Open log file
	this.fd = fs.openSync(filename, "a");

};

util.inherits(Logger.FileTarget, Logger.BaseTarget);

Logger.FileTarget.prototype.write = function(level, facility, msg){

	fs.write(this.fd, msg.join(" ") + "\n", null, "utf-8");

};

/**
 * JSON logger
 */
Logger.JsonFileTarget = function(filename, options){

	options = options || {};

	//Create log file
	if(!fs.existsSync(filename))
		fs.writeFileSync(filename, "{}", "utf-8");

	//call super
	Logger.FileTarget.call(this, filename, options);

};

util.inherits(Logger.JsonFileTarget, Logger.FileTarget);

Logger.JsonFileTarget.prototype.log = function(level, facility, msg){

	if(Logger.levels[level] > Logger.levels[this.level]) return;

	this.write(level, facility, msg);

};

Logger.JsonFileTarget.prototype.write = function(level, facility, msg){

	fs.write(this.fd, "," + JSON.stringify({
		timestamp: new Date(),
		level: level,
		facility: facility,
		msg: msg
	}), null, "utf-8");

}

//Export
module.exports = Logger;