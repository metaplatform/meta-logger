# meta-logger
Lightweight logging library for NodeJS with support of facilities and multiple transports.

## Usage
```javascript
var logger = require("meta-logger");

//Setup targets
logger.toConsole({
	level: "debug",
	timestamp: true,
	colorize: true
}).toFile("demo.log", {
	level: "info",
	timestamp: true,
	facilities: [ "test" ]
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

**Note:** console target is set by default.

## Configuring logging targets
### Console
Prints log messages to stdout (console).

```javascript
logger.toConsole({
	level: "debug",
	facilities: [...], //or null to accept all facilities
	timestamp: true,
	colorize: true,
	colors: {
		debug: 	colors.cyan,
		info: 	colors.white,
		warn: 	colors.yellow,
		error: 	colors.red
	}
});
```

Method `toConsole` overrides previous console target settings. You can use more console targets (for multiple configurations):

```
logger.to(new Logger.ConsoleTarget({
	///... options ...
}));
```

### File
Append log messages to specified file.

Message is formatted same way as to console.

File target can be set for multiple files with different configuration.

```javascript
logger.toFile(filename, {
	level: "debug",
	facilities: [...], //or null to accept all facilities
	timestamp: true
}).toFile(anotherFilename, {
	level: "error",
	timestamp: true,
	//...
});
```

### JSON file
Append log messages to specified file in JSON format.

```javascript
logger.toFile(filename, {
	level: "debug",
	facilities: [...], //or null to accept all facilities
	timestamp: true
}).toFile(anotherFilename, {
	level: "error",
	timestamp: true,
	//...
});
```

Log file has following format:

```
{},
{"timestamp":"2015-06-04T21:20:54.627Z","level":"warn","facility":null,"msg":["Hello %s","warn"]},
{"timestamp":"2015-06-04T21:20:54.629Z","level":"error","facility":"test","msg":["Hello %s","error"]}
...
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

## Custom logging levels
Logging levels can be set by modifying `logger.levels` property.

```javascript
logger.levels = {
		custom: 4,
		debug: 	3,
		info: 	2,
		warn: 	1,
		error: 	0
};
```

## License
This library is published under MIT license.

Copyright (c) 2015 Jiri Hybek, jiri.hybek@cryonix.cz