---
title: "Lucid Mud Engine Developer Guide - Services"
keywords: luicid mud engine, mud, mux, moo
tags: [world, developer]
sidebar: mydoc_sidebar
permalink: developer_services.html
summary: Documentation for the Lucid Mud Engine
---

## Services
The LME is made up of [Moleculer](http://moleculer.services/) micro-services. Each micro-service manages a specific 
domain of functionality within the LME.

### Service List

#### SnapshotDataService
##### SnapshotDataService
_services.snapshots_

The SnapshotDataService is used to create and pull world snapshots from the database.

###### Actions
* **findLatest** - returns the most recently saved snapshot
* **create(state)** - saves a snapshot to the database.
 
 
 is a sew services can be defined to extend the
capabilities of the LME as necessary. A Service is created by calling `Service.define(serviceName, ...definition)`. An
example is provided demonstrating the creation of a service that adds analytics abilities:

_AnalyticsService.js_
```javascript
const { Service } = require("lucid-engine");
const ua = require("universal-analytics");

const AnalyticsService = Service.define("analytics",
    Service.action("recordPlayerLogin", (ctx) => {
        const player = ua("UA-XXX-XX", ctx.params.player.uuid)
        player.event("session", "login").send()
    })
)

module.exports = AnalyticsService;
```

To start the service when the World process starts up:

_config/world.config.js_
```javascript
const { World } = require("lucid-engine");
const AnalyticsService = require("../services/AnalyticsService")

module.exports = World({
    onCreate() {
        this.createService(AnalyticsService());
    }
})
```

### Service Definitions
* **action(actionName: string, function)** - adds the given service action. Defined actions can be called 
`services.${serviceName}.${actionName}`.
* **method(methodName: string, function)** - add a private service method to the service.
* **onCreate(function)** - adds a function to be called when the service is created. The function will be passed the 
  Moleculer broker instance.
* **onStart(function)** - adds a function to be called when the service is started. Must return a **Promise**.
* **onStop(function)** -adds a function to be called when the service is stopped. Must return a **Promise**.