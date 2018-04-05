import {Portal} from './Broker';

describe('Broker', () => {
    it('defines the correct SERVICE_NAME', () => {
        const broker = new Portal.Broker();
        expect(broker.SERVICE_NAME).toEqual('Portal');
    });
});
