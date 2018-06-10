import { ServiceBroker } from "moleculer";

import { ObjectType, traits } from "../../ObjectTypes";
import { ServiceObjectTrait } from "./ServiceObjectTrait";

const mockLogger = {
    debug: jest.fn(),
};
const mockService = {
    logger: mockLogger,
};
global.broker = new ServiceBroker();
global.broker.createService = jest.fn().mockReturnValue(mockService);

@traits(ServiceObjectTrait)
class ServiceObjectType extends ObjectType {}

describe("ServiceObjectTrait", () => {
    let instance;

    beforeEach(() => {
        instance = new ServiceObjectType();
    });

    it("should create the service", () => {
        expect(global.broker.createService).toHaveBeenCalledWith(
            expect.objectContaining({
                actions: instance.actions,
                events: instance.events,
                methods: instance.methods,
                name: instance.key,
            }),
        );
    });

    it("sets the return of createService to this.service", () => {
        expect(instance.service).toEqual(mockService);
    });

    it("sets the logger to the service logger", () => {
        expect(instance.logger).toEqual(mockService.logger);
    });
});
