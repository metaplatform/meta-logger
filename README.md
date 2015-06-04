# meta-logger
Lightweight logging library for NodeJS with support of facilities and multiple transports.

## Usage
Following code demonstrates usage of meta-logger with all logging methods and targets params.

```javascript
var logger = require("meta-logger");

//Setup targets
logger.toConsole({
	level: "debug",
	timestamp: true,
	colorize: true
}).toFile("demo.log", {
	level: "info",
	timestamp: true
}).toJsonFile("demo.json", {
	level: "warn"
});

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
```

## Custom logging target
Custom logger is defined by instance of simple object which implements `log` method and registered to logger via `to` method.

Following example shows how to define custom target:

```javascript
var MyTarget = function(options){

	options = options || {};
	this.prefix = options.prefix || "";

};

MyTarget.prototype.log = function(level, facility, args){

	console.log(level, facility, this.prefix, util.format.apply(this, args));

};

logger.to(new MyTarget({
	prefix: "my-target"
}));
```

Following example shows how to inherit BaseTarget:

```javascript
var MyTarget = function(options){

	options = options || {};
	this.prefix = options.prefix || "";

	logger.BaseTarget.call(this, options);

};

util.inherits(MyTarget, logger.BaseTarget);

MyLogger.prototype.write = function(level, facility, msg){

	console.log(level, facility, this.prefix, msg.join(" "));

};
```

## License
This library is published under MIT license.

Copyright (c) 2015 Jiri Hybek, jiri.hybek@cryonix.cz