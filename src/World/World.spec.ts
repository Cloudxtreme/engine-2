import {ServiceBroker} from 'moleculer';

import {DEFAULT_CONFIG, World} from './World';
import {WorldLoop} from './WorldLoop';

jest.mock('./WorldLoop');

const mockBroker = new ServiceBroker();
mockBroker.createService = jest.fn();
console.log = jest.fn();

const CONFIG = {
    name: 'TestWorld',
};

describe('World', () => {
    let schema;

    beforeEach(() => {
        schema = World(CONFIG);
    });

    it('sets the nodeID', () => {
        expect(schema.nodeID).toEqual('lucid-world');
    });

    it('sets the transporter to the redis url', () => {
        expect(schema.transporter).toEqual(DEFAULT_CONFIG.transporter);
    });

    it('sets validation to true', () => {
        expect(schema.validation).toEqual(true);
    });

    describe('created', () => {
        it('creates the WorldLoop service', () => {
            schema.created(mockBroker);
            expect(WorldLoop).toHaveBeenCalledWith({
                ...DEFAULT_CONFIG,
                ...CONFIG,
            });
        });
    });

});
