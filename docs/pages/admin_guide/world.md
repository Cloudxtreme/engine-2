---
title: "Lucid Mud Engine Admin Guide - The Portal Process"
keywords: luicid mud engine, mud, mux, moo
tags: [portal,admin_guide]
sidebar: mydoc_sidebar
permalink: admin_portal_overview.html
summary: Documentation for the Lucid Mud Engine
---

 The World process runs the actual implementation of the game. It is a [Moleculer]() broker process that spins up the
 various services required to run the game world. It can be configured by passing in the configuration values to the
 function.

## Configuration
The World can be configured within the `config/world.config.js` file by passing in  the configuration options to the
`World` function:

```javascript
require('./config');

const { World } = require("lucid-engine");

module.exports = World({
    name: "Example"
});

```

### Options
#### name
The name of the world. This can be any string value, and may be displayed to the player at various points.

#### transporter
_default: nats://localhost:4242_

The transporter to use for the Moleculer services. The LME is tested using both [nats]() and [redis]() transporters.
 
#### logLevel
_default: debug_

The logLevel sets the verbosity at which logging happens. It a may be set to `fatal`, `error`, `warn`, `info`, `debug`,
and `trace`.

## Running
### Development Mode
Running the World process in development mode is relatively simple. From the game directory call `yarn run world` from 
the command line.

### Production


## Services
The LME World process is made up of individual services, each providing specific functionality. For more information on
creating custom services see the [Developer Guide]().

### SnapshotDataService
_services.snapshots_

The SnapshotDataService is used to create and pull world snapshots from the database.

#### Actions
* **findLatest** - returns the most recently saved snapshot
* **create(state)** - saves a snapshot to the database.

### StateService
