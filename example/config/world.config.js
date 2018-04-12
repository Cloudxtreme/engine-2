const { Broker } = require("../../build/src/World");
const world = new Broker();

module.exports = world.schema();