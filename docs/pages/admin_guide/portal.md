---
title: "Lucid Mud Engine Admin Guide - The Portal Process"
keywords: luicid mud engine, mud, mux, moo
tags: [portal,admin_guide]
sidebar: mydoc_sidebar
permalink: admin_portal_overview.html
summary: Documentation for the Lucid Mud Engine
---

The Portal process handles the incoming connections from the player and proxies the player input to the [World](), and
the World output back to the Player. Only one Portal should be run per game instance. 

## Configuration
The Portal process is configured through the `config/portal.config.js` file. Example:
```javascript
require('./config');
const { Portal } = require("lucid-engine");

module.exports = Portal({
    host: 'tcp://localhost:2323',
    redis: process.env.REDIS_URL
});
```

### host (default: tcp://localhost:2323)
The host that the Portal should listen on for incoming connections. Use `tcp://0.0.0.0:<port>` to listen on all 
interfaces.

### redis (default redis://localhost:6379)
The [Redis]() connection to use. This **must** be the same Redis server as the [World]() process.

## Running
### Development
The Portal process can be run in development by calling `yarn portal`

### Production
Coming soon...
