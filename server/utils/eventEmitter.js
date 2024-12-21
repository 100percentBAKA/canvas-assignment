const EventEmitter = require("events");
const exportEvents = new EventEmitter();

exportEvents.on("export", (type, filePath) => {
  console.log(`Export successful: Type: ${type}, Path: ${filePath}`);
});

module.exports = exportEvents;
