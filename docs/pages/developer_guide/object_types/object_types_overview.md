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
_compoed of: EventEmitter_

A `ServiceBrokerObjectType` object is special in that it is considered "live", or in other words it gets it's own
[moleculer service](http://moleculer.services/0.12/docs/service.html) and can interact directly with other objects. 
This type of object can be used to create [mobs](https://en.wikipedia.org/wiki/Mob_(gaming)) that react to their 
environment, dynamic objects that access external apis or resources, or even magical artifacts with minds of their own. 
The name of the service is the key of the object when created. The type can define the `created`, `started`, and
`stopped` [lifecycle events](http://moleculer.services/0.12/docs/service.html#Lifecycle-events).

#### Props
Most of the props derived from a ServiceObject are used to set up the service and follow the rules explained in the
[moleculer service documentation](http://moleculer.services/0.12/docs/service.html).
* **actions: [ServiceActions](http://moleculer.services/0.12/docs/service.html#Actions)** - the actions the object 
  makes available
* **methods: [ServiceMethods](http://moleculer.services/0.12/docs/service.html#Methods)** - methods locally available 
  to the service, all methods defined in any `ObjectType` that inherits this `ObjectType` will automatically be added to
  the service's `methods`.
* **events: [ServiceEvents](http://moleculer.services/0.12/docs/service.html#Events)** - moleculer events that the
  service subscribes to. This can be any event that can broadcast to the moleculer broker. The service will 
  automatically subscribe to all events matching the pattern `objects.${this.key}.*`, and emit them to the local object 
  emitter.

