---
title: "Lucid Mud Engine Developer Guide - ObjectTypes and ObjectTraits"
keywords: luicid mud engine, mud, mux, moo
tags: [world]
sidebar: mydoc_sidebar
permalink: object_type_overview.html
summary: Documentation for the Lucid Mud Engine
---

The LME has a powerful object system capable of composing complex objects with very little effort. There are two 
concepts the developer must understand to create custom objects, those are [`ObjectTypes`]() and [`ObjectTraits`]().

## ObjectTypes

`ObjectTypes` are the classes from which the world objects are derived. Defining a new basic object can be done by 
creating a new class that extends the `ObjectType` class:

```javascript
const { ObjectType } = require("lucid-mud")

class CustomObjectType extends ObjectType {
    //...
}
``` 
Developers should never extend any other object other than `ObjectType` when creating new objects. If you wish to
extend an object type with multiple traits, you should use `ObjectTraits` instead.


## ObjectTraits
