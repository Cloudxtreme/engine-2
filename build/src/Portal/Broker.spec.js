"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Broker_1 = require("./Broker");
describe('Broker', () => {
    it('defines the correct SERVICE_NAME', () => {
        const broker = new Broker_1.Broker();
        expect(broker.SERVICE_NAME).toEqual('Portal');
    });
    it('sets the default host value in config', () => {
        const broker = new Broker_1.Broker();
        expect(broker.config.host).toEqual('tcp://0.0.0.0:2323');
    });
});
//# sourceMappingURL=Broker.spec.js.map