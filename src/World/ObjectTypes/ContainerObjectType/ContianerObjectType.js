import { combine } from "../ObjectType";
import { EventedObjectType } from "../EventedObjectType";

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
            object.container = this;
            this.objects[object.key] = object;
            this.emit("object.added", { ...{}, ...object });
        },
        removeObject(objectOrKey) {
            if (typeof objectOrKey === "object") {
                objectOrKey = object.key;
            }
            const objectToRemove = { ...{}, ...this.objects[objectOrKey] };
            delete objectToRemove.container;
            delete this.objects[objectOrKey];
            this.emit("object.removed", objectToRemove);
        },
        afterValidate() {
            this.on("object.removed", object => {
                if (this.container) {
                    this.container.emit("object.removedFromDescendant", {
                        key: this.key,
                        object: object
                    });
                }
            });
            this.on('object.removedFromDescendant', ({key, object}) => {
                if (this.container) {
                    this.container.emit("object.removedFromDescendant", {key: `${this.key}.${key}`, object})
                }
            });
            this.on('object.added', object => {
                if (this.container) {
                    this.container.emit('object.addedToDescendant', {key: `${this.key}.${object.key}`, object})
                }
            });
            this.on('object.addedToDescendant', ({key, object}) => {
                if(this.container) {
                    this.container.emit("object.addedToDescendant", {key: `${this.key}.${key}`, object})
                }
            })
        }
    };
};

ContainerObjectType = combine(EventedObjectType, ContainerObjectType);

export { ContainerObjectType };
