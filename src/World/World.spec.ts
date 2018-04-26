import {World} from './World';

describe('World', () => {
    let world;
    beforeEach(() => {
        world = new World();
    });

    it('should have the correct name', () => {
        expect(world.PROCESS_NAME).toEqual('World');
    });
});
