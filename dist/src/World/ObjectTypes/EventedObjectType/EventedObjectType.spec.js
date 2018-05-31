'use strict';

var _events = require('events');

var _EventedObjectType = require('./EventedObjectType');

describe('EventedObjectType', function () {
    it('should have an event emitter', function () {
        return (0, _EventedObjectType.EventedObjectType)().then(function (traits) {
            return expect(traits.emitter instanceof _events.EventEmitter).toBeTruthy();
        });
    });

    describe('on', function () {
        var instance = void 0;
        beforeEach(function () {
            instance = (0, _EventedObjectType.EventedObjectType)();
        });

        it('adds the event emitter to the actual emitter', function () {
            return instance.then(function (object) {
                object.emitter.on = jest.fn();
                object.on('foo', { bar: 'baz' });
                return expect(object.emitter.on).toHaveBeenCalledWith('foo', { bar: 'baz' });
            });
        });

        it('adds the event emitter to the actual emitter', function () {
            return instance.then(function (object) {
                object.emitter.emit = jest.fn();
                object.emit('foo', { bar: 'baz' });
                return expect(object.emitter.emit).toHaveBeenCalledWith('foo', { bar: 'baz' });
            });
        });
    });
});
//# sourceMappingURL=EventedObjectType.spec.js.map