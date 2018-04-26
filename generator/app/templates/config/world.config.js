require('./config');
const { World } = require("lucid-engine");

const world = new World({
    // Your configuration settings here.
});

// This line is required, it exports the Broker schema used by Moleculer Runner.
module.exports = world.schema();
