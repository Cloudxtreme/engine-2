import {ServiceBroker} from 'moleculer';

import {WorldLoop} from './WorldLoop';

let broker;
let worldLoop;

describe('WorldLoop', () => {
    beforeEach(() => {
        broker = new ServiceBroker();
        worldLoop = new WorldLoop(broker);
        worldLoop.logger = {
            debug() {
                return;
            },
        };
    });
    describe('player.created', () => {
        it('sets up the event', () => {
            expect(worldLoop.schema().events['player.connected']).toEqual(worldLoop.playerConnected);
        });
    });
});
