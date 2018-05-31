import { EventEmitter } from "events";
import { combine } from "../ObjectType";

let EventedObjectType = traits => ({
    ...traits,
    emitter: new EventEmitter(),
    on(name, cb) {
        this.emitter.on(name, cb);
    },
    emit(name, ...args) {
        this.emitter.emit(name, ...args);
    }
});

EventedObjectType = combine(EventedObjectType);

export { EventedObjectType };
