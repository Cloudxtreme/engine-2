---
title: "Lucid Mud Engine Developer Guide - Object Types"
keywords: luicid mud engine, mud, mux, moo
tags: [world]
sidebar: mydoc_sidebar
permalink: object_types.html
summary: Documentation for the Lucid Mud Engine
---
Every world is made up of objects. These are the items that the player interacts with, the creatures through otu the 
world, the rooms that make up the world, and even the actual player Character. The LME sports a powerful, yet simple to
understand object typing system, that allows the developer to create custom types with ease.


## ObjectType
ObjectType is the base type from which all other objects are derived. World objects are never created from ObjectType,
but instead are created with the various extensions of this type. Every object has the following properties defined:

### Properties 
* **uuid** - this is the unique ID for the object. The UUID is never set by the developer but instead determined by the
  world.
* **key** - the unique name of the object in the world. The key is similar to the UUID as it must be 100% unique,
  however unlike the UUID specific ObjectType classes can determine what the key. For example a Character's key is
  the character name. If the key is not defined by the class, the object will be given a key named after the ObjectType
  appended with the last characters of the object's UUID. For example, if the name of the ObjectType were 
  SwordObjectType, the generated key for the object would be `sword:<uuid>` where \<uuid\> is the last character set of
  that objects UUID.
* **objectType** - the name of the objects ObjectType. In the example of the SwordObject type, the objectType is set to
  `"SwordObjectType"`.
* **schema** - the schema is used to validate built objects. Every time an object is created, it is validated against 
  the schema. The schema itself is set by every ObjectType the parent extends, as well as itself.
* **createdAt** - the `Date` at which the object was created.
* **updatedAt** - the `Date` at which the object was last updated.

### Life Cycle Hooks
* **beforeCreate(props, config)** - beforeCreate is a function that should return a promise that resolves to the object 
  props and is called before an object is created. It is passed the World  configuration This is useful for doing 
  things before the object is placed in the world.
  
## ContainerObjectType
A `ContainerObjectType` can contain other objects. This can be anything from a backpack to an alternate dimension, the
object type simply adds functionality allowing inherited types to receive and contain their own objects.

### Properties
* **objects** - the objects this object contains.
  
## Custom ObjectTypes
Custom ObjectTypes can be defined in the `object_types`  directory of the game. An ObjectType file consists of at least
two parts:

1. The ObjectType function. This is either a named function, or an anonymous function that returns the `objectType` 
   property. LME convention dictates that the name of the ObjectType should always be suffixed with "ObjectType" 
   (example: `WeaponObjectType`). The ObjectService will automatically load and register object types and make them 
   available to the ObjectService.
 
 2. A `combine` statement. This function does the heavy lifting of combining the traits of various object
    types together, validation, and life cycle management, It returns a function that when called will build an object
    of the prepared type.

### ObjectType Function
An ObjecType function is simply  a function that accepts a set of props (a [POJO]()), and provides a new POJO in return.
The only argument passed the function will be the combined `props` passed down from the ObjecTypes higher up the chain
 as well as the props passed in during object creation.

### combine
The `combine` function is used to combine the traits and behaviors into a new object type. It accepts any
number of ObjectType functions and combines them into a new composite of the combined result. When an object is created,
each ObjectType is called in the order it was listed.
 
### Basic Object Types
A basic object type is simply defined as a function. In the following example we create a simple glass bottle:

```javascript
const GlassObjectType = function(props) {
    return {
        breakable: true
   }
}

module.exports = combine(GlassBottleObjectType)
```

When objects are created from this ObjectType they will inherit the attributes of the type:

```javascript
const bottle = createObject('GlassBottle') // { breakable: true }
```

Props that are passed during ObjectCreation are subsequently passed to each ObjecType during the object's construction.
For example:

```javascript
const bottle = createObject('GlassBottle', {key: 'bottleOfTonic'})
```

### EventedObjectType
EventedObjectType simply provides an event emitter within the object.

#### Functions
* **on(name, callback)** - adds the given callback as a listener for the given name.
* **emit(name, args)** - emits the given event.

### Composite Object Types

A composite ObjectType can be created by combining several  object types together when registering the ObjectType. This
way complex ObjectTypes may be constructed implementing the traits and behaviors of each of the sub-types. Using the 
previous `GlassObjectType` example, we can extend it to be a bottle:

```javascript
const BottleObjectType = function(props) {
    return {
        get drinkable() {
            if(this.hasLiquid) return true;
            return false;
        },
        canHaveLiquid: true,
        liquid: nil,
    },
    ...props
}

module.exports = combine(GlassObjectType, BottleObjectType)
```

Any Bottle created will inherit both the `GlassObjectType` and the `BottleObjectType`. We can enhance this further by
weaponizing it:

```javascript
const MolotovCocktailObjectType = function(props) {
    return {
        canBeThrown: true,
        canBeLit: true,
        damage: 100
    }
}

module.exports = combine(BottleObjectType, WeaponObjectType, MolotovCocktailObjectType)
```

Now we have an ObjectType that inherits traits from the Bottle and Weapon ObjectTypes as well as defining its own new 
traits.

### Life Cycle Hooks 
ObjectTypes can define life cycle hooks. All hooks of inherited ObjectTypes will be fired in the order that the
ObjectType was composited.

**Important Note:** Life cycle hooks should be defined in such a way that they are not overwritten by other props,
otherwise they will not be called, and the developer risks firing the same hook twice.

**Good**
```javascript
const SomeObjectType  = (props) => ({
    ...props,
    beforeValidate(props) {
        // ...
    }
})
```

**Bad**
```javascript
const SomeObjectType  = (props) => ({
    beforeValidate(props) {
        // ...
    },
    ...props
})
```

#### beforeValidate
Fired before the object is created, and before it is validated. This is useful for setting up traits or attributes
before validation happens.

### Validation
Objects are validated using [validate.js](https://validatejs.org/#validate-async), and each ObjectType can define it's 
validations in the `schema` prop following the the standards in the validate.js documentation. In addition to the 
default validations available, the following additional validations may be used within the LME:

#### unique
Validates the uniqueness of the field. The uniqueness validation can be either scoped to the the specific ObjectType or
it can be required to be globally unique for the given prop name.

##### options
* **global (boolean)** - if `true`, the the field will be required to be unique across all objects. For example, the `key`
  field is globally unique. If `false`, the field value will only be unique to the ObjectType.


#### objectType
Validates a field as a valid ObjectType based on that type's schema. This can be applied to a plain object, an object 
whose values are ObjectTypes, or an array of ObjectTypes. `true`, the value must also validate as a valid ObjectType. If 
`'array'` the validator will validate each item in the array. If `'object'`, the validator will validate all of the values 
of the object.

