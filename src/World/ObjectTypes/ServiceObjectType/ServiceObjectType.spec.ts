import { ServiceBroker } from "moleculer";

import { compose, ObjectType } from "../ObjectType";
import { ServiceObjectType } from "./ServiceObjectType";

const mockLogger = {
    debug: jest.fn(),
};
const mockService = {
    logger: mockLogger,
};

const mockFunction = jest.fn();

global.broker = new ServiceBroker();
global.broker.createService = jest.fn().mockReturnValue(mockService);

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
