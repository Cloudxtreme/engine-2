---
title: "Lucid Mud Engine Developer Guide - WorldObjectType StateService"
keywords: luicid mud engine, mud, mux, moo
tags: [world]
sidebar: mydoc_sidebar
permalink: world_overview.html
summary: Documentation for the Lucid Mud Engine
---

The WorldObjectType StateService is managed in the pattern set out by [Flux](https://facebook.github.io/flux/) and 
[Redux](https://redux.js.org/). In essence state management in the LME follows the same three principles as Redux.

## Three Principles

### Single Source of Truth
The existing state is always pulled from, and stored in [Redis](https://redis.io/), the only exception is during the
initial load of the world in which the state will be initialized from the last [snapshot]() that was persisted to 
[MongoDB]().

### StateService is Read Only
The state is never modified in place. When modifications to the state are necessary, an entirely new state is created
rather than mutating the existing one.

### Changes are Made with Pure Functions
The state can only be mutated by an action. An action is simply a function that takes the current state and the action
context and returns the new mutated state. This differs slightly from Redux in that the LME doesn't have the concept of
a reducer. Because the outcome of the action is entirely dependent on the individual player or object the action action
was called against, the action will be executed directly against the service representing that object.

## Persistence
The WorldObjectType StateService is persisted first and foremost to Redis. Because multiple world processes can be run in parallel, the
state in Redis represents the single source of truth for the entire state of the WorldObjectType. This happens once every 
[WorldLoop](). A snapshot of the state is also persisted to MongoDB once every WorldLoop. 

## StateService Tree
```json
{
  "_id": "mongo_id_of_snapshot",
  "name": "Your WorldObjectType Name",
  "snapshotTime": 1212342121,
  "storage": {},
}
```

### Storage

