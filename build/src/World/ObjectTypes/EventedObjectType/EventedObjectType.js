"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const ObjectType_1 = require("../ObjectType");
class EventedObjectType extends ObjectType_1.ObjectType {
    constructor() {
        super(...arguments);
        this.emitter = new events_1.EventEmitter();
    }
    on(event, cb) {
        this.emitter.on(event, cb);
    }
    emit(event, ...args) {
        this.emitter.emit(event, ...args);
    }
}
exports.EventedObjectType = EventedObjectType;
//# sourceMappingURL=EventedObjectType.js.map