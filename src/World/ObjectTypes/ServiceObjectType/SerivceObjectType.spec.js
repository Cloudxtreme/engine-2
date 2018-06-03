const {ServiceBroker} = require('moleculer');

const {ServiceObjectType} = require('./ServiceObjectType');

global.broker = new ServiceBroker();
global.broker.createService = jest.fn();

describe('ServiceObjectType', () => {
    let instance;

    beforeEach(() => {
        instance = ServiceObjectType();
    });


    it('should inherit the traits of the EventedObjectType', () => {
        return instance
            .then((traits) => expect(traits.inherits('EventedObjectType')).toBeTruthy())
    })

    it('should register the service with the broker', () => {
        return instance
            .then((traits) => expect(global.broker.createService).toHaveBeenCalledWith(traits));
    })
});