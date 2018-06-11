"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
function EventEmitterObjectTrait(Base) {
    return class extends Base {
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
    };
}
exports.EventEmitterObjectTrait = EventEmitterObjectTrait;
//# sourceMappingURL=EventEmitterObjectTrait.js.map