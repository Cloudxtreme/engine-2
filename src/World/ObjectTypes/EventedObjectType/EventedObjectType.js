const { EventEmitter } =  require("events");
const { combine } = require("../ObjectType");

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

module.exports.EventedObjectType = combine(EventedObjectType);
