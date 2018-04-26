require('./config');
const { Portal } = require("lucid-engine");

const listener = new Portal({
    // Your configuration settings here.
});


// This line is required, it exports the Broker schema used by Moleculer Runner.
module.exports = listener.schema();
