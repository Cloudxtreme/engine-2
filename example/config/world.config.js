const { World } = require("../../build/src/World");

const world = new World({
    // Your configuration settings here.
});

module.exports = world.schema();
