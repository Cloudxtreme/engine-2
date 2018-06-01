const { combine } = require("../ObjectType");
const { EventedObjectType } = require("../EventedObjectType");

let ContainerObjectType = traits => {
    const schema = {
        objects: {
            presence: true,
            objectType: "object"
        }
    };

    return {
        objects: {},
        ...traits,
        schema,
        addObject(object) {
            this.objects[object.key] = object;
            this.objects[object.key].container = this;
            this.emit("object.added", this.objects[object.key]);
        },
        removeObject(objectOrKey) {
            if (typeof objectOrKey === "object") {
                objectOrKey = objectOrKey.key;
            }
            const objectToRemove = this.objects[objectOrKey];
            delete objectToRemove.container;
            delete this.objects[objectOrKey];
            this.emit("object.removed", objectToRemove);
        },
        onRemoved(object) {
            if (this.container) {
                this.container.emit("object.removedFromDescendant", {
                    key: `${this.key}.${object.key}`,
                    object
                });
            }
        },
        onRemovedFromDescendant({ key, object }) {
            if (this.container) {
                this.container.emit("object.removedFromDescendant", {
                    key: `${this.key}.${key}`,
                    object
                });
            }
        },
        afterValidate() {
            this.on("object.removed", this.onRemoved);
            this.on("object.removedFromDescendant", this.onRemovedFromDescendant);
            this.on("object.added", object => {
                if (this.container) {
                    this.container.emit("object.addedToDescendant", {
                        key: `${this.key}.${object.key}`,
                        object
                    });
                }
            });
            this.on("object.addedToDescendant", ({ key, object }) => {
                if (this.container) {
                    this.container.emit("object.addedToDescendant", {
                        key: `${this.key}.${key}`,
                        object
                    });
                }
            });
        }
    };
};

module.exports.ContainerObjectType = combine(EventedObjectType, ContainerObjectType);
