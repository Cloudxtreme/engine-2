import {Portal} from './Portal';

class TestClass extends Portal {
    public defaultConfig() {
        return this.DEFAULT_CONFIG;
    }

    public name() {
        return this.PROCESS_NAME;
    }
}

let testClass;

describe('Portal', () => {
    beforeEach(() => {
        testClass = new TestClass();
    });

    it('sets the DEFAULT_CONFIG to the correct value', () => {
        expect(testClass.defaultConfig()).toEqual({
            host: 'tcp://0.0.0.0:2323',
        });
    });

    it('sets the PROCESS_MAME to the correct value', () => {
        expect(testClass.name()).toEqual('Portal');
    });
});
