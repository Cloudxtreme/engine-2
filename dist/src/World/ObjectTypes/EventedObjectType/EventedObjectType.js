"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventedObjectType = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _events = require("events");

var _ObjectType = require("../ObjectType");

var EventedObjectType = function EventedObjectType(traits) {
    return _extends({}, traits, {
        emitter: new _events.EventEmitter(),
        on: function on(name, cb) {
            this.emitter.on(name, cb);
        },
        emit: function emit(name) {
            var _emitter;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            (_emitter = this.emitter).emit.apply(_emitter, [name].concat(args));
        }
    });
};

exports.EventedObjectType = EventedObjectType = (0, _ObjectType.combine)(EventedObjectType);

exports.EventedObjectType = EventedObjectType;
//# sourceMappingURL=EventedObjectType.js.map