---
title: "Lucid Mud Engine Developer Guide - ObjectTypes"
keywords: luicid mud engine, mud, mux, moo
tags: [world]
sidebar: mydoc_sidebar
permalink: object_type_overview.html
summary: Documentation for the Lucid Mud Engine
---
## Basic Object Types
### ContainerObjectType
_composed of: EventedObjectType_

Objects of the  `ContainerObjectType`  allows objects to be placed inside of it. A generic container object has no
volume or object count limit.
#### Functions
* **add(pathOrObject: ObjectType | string, object: ObjectType)** - adds the provided object to the parent in the given 
  path. If an object is provided instead of a path, the object will be added to the immediate parent. If a path is 
  provided along with an object, the object will be added to what ever object the path points to. Example:
```javascript
object.add(anotherObject) // adds anotherObject to object
object.add("child.grandchild", anotherObject) // adds anotherObject to the object's grandchild
```
* **remove(pathOrObject: ObjectType | string)** - removes the object at the given path, or the provided object from 
  the immediate parent. Example:
```javascript
object.remove(anotherObject) // removes anotherObject from the object
object.remove("child.grandchild.anotherObject") // removes anotherObject from the object's grandchild
```
#### Events
* **objectAdded(object: ObjectType)** - fired when an object is added, passed the added object.
* **objectRemoved(object: ObjectType)** - fired when an object is removed, passed the removed object.

### EventedObjectType
Objects capable of listening for or responding to events.
#### Functions
* **on(event: string, callback: Function)** - adds a listener for the provided event.
* **emit(event: string, args: any[])** - emits an event with the provided arguments.
### ServiceObjectType
