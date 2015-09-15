## Logging targets

### Console

::: sidecode
```javascript
logger.toConsole({
	level: "debug",
	facilities: [...], //or null to accept all facilities
	timestamp: true,
	colorize: true,
	colors: {
		debug: 	logger.colors.cyan,
		info: 	logger.colors.white,
		warn: 	logger.colors.yellow,
		error: 	logger.colors.red
	}
});
```
:::

Prints log messages to stdout (console).

Console targets accepts following configuration properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| level | string | Logging level (debug / info / warn / error) |
| facilities | array | Log only specified facilities |
| timestamp | boolean | Print timestamp |
| colorize | boolean | Print messages with colors |
| colors | object | Colors for message levels - see [colors module](https://www.npmjs.com/package/colors). |

::: sidecode
```javascript
logger.to(new Logger.ConsoleTarget({
	///... options ...
}));
```
:::

::: warning
Method `toConsole` overrides previous console target settings.

You can use more console targets (for multiple configurations) by creating target instance manually.
:::

### File

::: sidecode
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
:::

Append log messages to specified file. Message is formatted same way as to console.

File target accepts following configuration properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| level | string | Logging level (debug / info / warn / error) |
| facilities | array | Log only specified facilities |
| timestamp | boolean | Print timestamp |

::: info
File target can be set for multiple files with different configurations.
:::

### JSON file

::: sidecode
```javascript
logger.toJsonFile(filename, {
	level: "debug",
	facilities: [...], //or null to accept all facilities
	timestamp: true
});
```

### Format of JSON log file

```
{},
{"timestamp":"2015-06-04T21:20:54.627Z","level":"warn","facility":null,"msg":["Hello %s","warn"]},
{"timestamp":"2015-06-04T21:20:54.629Z","level":"error","facility":"test","msg":["Hello %s","error"]}
...
```
:::

Append log messages to specified file in JSON format.

JSON target accepts following configuration properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| level | string | Logging level (debug / info / warn / error) |
| facilities | array | Log only specified facilities |
| timestamp | boolean | Print timestamp |

### Custom logging target

::: sidecode
```javascript
var util = require("util");

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
:::

Custom target is defined by instance of simple object which implements `log` method and is registered to logger via `to` method.

::: info
You can also extend BaseTarget.
:::

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