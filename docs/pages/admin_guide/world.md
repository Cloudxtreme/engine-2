---
title: "Lucid Mud Engine Admin Guide - The Portal Process"
keywords: luicid mud engine, mud, mux, moo
tags: [portal,admin_guide]
sidebar: mydoc_sidebar
permalink: admin_portal_overview.html
summary: Documentation for the Lucid Mud Engine
---

The WorldObjectType Process is the actual game. It is responsible for handling the player interaction and managing the state
of the game world.

## Configuration
The WorldObjectType process is configured through the `config/world.config.js` file. Example:
```javascript
require('./config');
const { WorldObjectType } = require("lucid-engine");

module.exports = WorldObjectType({
    name: 'Example WorldObjectType',
    transporter: process.env.TRANSPORT_URL
});
```

### name
The WorldObjectType name is required, this is the name of your game or game world.

### transporter (default redis://localhost:6379)
The [Transporter]() connection to use. This is used by Moleculer and **must** be the same value as used in the WorldObjectType 
process. This allows the communication between the Portal and the WorldObjectType processes. 
