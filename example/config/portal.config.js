const { Broker } = require("../../build/src/Portal");
const listener = new Broker();

module.exports = listener.schema();