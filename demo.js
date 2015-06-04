/*
 * Logger / metaPlatform
 *
 * @author Jiri Hybek <jiri.hybek@cryonix.cz> / Cryonix Innovations <www.cryonix.cz>
 * See LICENSE file distributed with this source code for licensing info
 */

var logger = require("./");
var util = require("util");

//Custom transport
var MyTarget = function(options){

	options = options || {};
	this.prefix = options.prefix || "";

};

MyTarget.prototype.log = function(level, facility, args){

	console.log(level, facility, this.prefix, util.format.apply(this, args));

};

//Setup transports
logger.toConsole({
	level: "debug",
	timestamp: true,
	colorize: true
}).toFile("demo.log", {
	level: "info",
	timestamp: true
}).toJsonFile("demo.json", {
	level: "warn"
}).to("my", new MyTarget({
	prefix: "my-target"
}));

//Logging without specifying facility
logger.log("info", "Hello %s", "world");
logger.debug("Hello %s", "debug");
logger.info("Hello %s", "info");
logger.warn("Hello %s", "warn");
logger.error("Hello %s", "error");

//Create facility shorthand
var facilityLogger = logger.facility("test");

//Log with facility prefix
facilityLogger.log("info", "Hello %s", "world");
facilityLogger.debug("Hello %s", "debug");
facilityLogger.info("Hello %s", "info");
facilityLogger.warn("Hello %s", "warn");
facilityLogger.error("Hello %s", "error");