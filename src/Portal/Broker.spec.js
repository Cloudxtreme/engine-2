"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Broker_1 = require("./Broker");
describe('Broker', () => {
    it('defines the correct SERVICE_NAME', () => {
        const broker = new Broker_1.Portal.Broker();
        expect(broker.SERVICE_NAME).toEqual('Portal');
    });
});
//# sourceMappingURL=Broker.spec.js.map