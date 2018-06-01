const {EventEmitter} =  require('events');
const {EventedObjectType}  = require("./EventedObjectType");

describe('EventedObjectType', () => {
    it('should have an event emitter', () => {
        return EventedObjectType()
            .then(traits => expect(traits.emitter instanceof EventEmitter).toBeTruthy())
    });

    describe('on', () => {
        let instance;
        beforeEach(() => {
            instance = EventedObjectType();
        });

        it('adds the event emitter to the actual emitter', () =>{
            return instance
                .then(object => {
                    object.emitter.on = jest.fn();
                    object.on('foo', {bar: 'baz'});
                    return expect(object.emitter.on).toHaveBeenCalledWith('foo', {bar: 'baz'})
                })
        });

        it('adds the event emitter to the actual emitter', () =>{
            return instance
                .then(object => {
                    object.emitter.emit = jest.fn();
                    object.emit('foo', {bar: 'baz'});
                    return expect(object.emitter.emit).toHaveBeenCalledWith('foo', {bar: 'baz'})
                })
        })
    })
});