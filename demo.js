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
	colorize: true,
}).toFile("demo.log", {
	level: "info",
	timestamp: true,
}).toJsonFile("demo.json", {
	level: "warn"
}).to("my", new MyTarget({
	prefix: "my-target"
})).to("another-console", new logger.ConsoleTarget({
	level: "debug",
	timestamp: false,
	facilities: ["test-b"]
}));

//Logging without specifying facility
logger.log("info", "Hello %s", "world");
logger.debug("Hello %s", "debug");
logger.info("Hello %s", "info");
logger.warn("Hello %s", "warn");
logger.error("Hello %s", "error");

//Create facility shorthand
var facilityLoggerA = logger.facility("test-a");
var facilityLoggerB = logger.facility("test-b");

//Log with facility prefix
facilityLoggerA.log("info", "Hello %s", "world");
facilityLoggerA.debug("Hello %s", "debug");
facilityLoggerB.info("Hello %s", "info");
facilityLoggerA.warn("Hello %s", "warn");
facilityLoggerB.error("Hello %s", "error");