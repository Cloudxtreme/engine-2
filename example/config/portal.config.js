const {Portal} = require("../../build/src/Portal");
const listener = new Portal.Broker();

module.exports = listener.schema();