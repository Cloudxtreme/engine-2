import {Broker, IPortalConfig} from './Broker';

describe('Broker', () => {
    it('defines the correct PROCESS_NAME', () => {
        const broker = new Broker();
        expect(broker.PROCESS_NAME).toEqual('Portal');
    });

    it('sets the default host value in config', () => {
        const broker = new Broker();
        expect(broker.config.host).toEqual('tcp://0.0.0.0:2323');
    });
});
