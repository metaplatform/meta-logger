:::sidecode
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
:::

## Usage

Import module

```javascript
var logger = require("meta-logger");
```

Setup logging target:

```javascript
logger.toConsole({
	level: "debug",
	timestamp: true,
	colorize: true
});
```

::: info
Console target is set by default.
:::

Log few messages:

```javascript
logger.log("info", "Hello %s", "world");
logger.debug("Hello %s", "debug");
logger.info("Hello %s", "info");
logger.warn("Hello %s", "warn");
logger.error("Hello %s", "error");
```

::: success
Logging methods accepts same arguments as `console.log` function.
:::

Create facility and log something:

```javascript
var facilityLogger = logger.facility("test");

facilityLogger.log("info", "Hello %s", "world");
facilityLogger.debug("Hello %s", "debug");
facilityLogger.info("Hello %s", "info");
facilityLogger.warn("Hello %s", "warn");
facilityLogger.error("Hello %s", "error");
```