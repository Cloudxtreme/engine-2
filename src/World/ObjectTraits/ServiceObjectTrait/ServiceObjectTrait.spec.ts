import { ServiceBroker } from "moleculer";

import {ObjectType, traits} from "../../ObjectTypes";
import { ServiceObjectTrait } from "./ServiceObjectTrait";

global.broker = new ServiceBroker();

@traits(ServiceObjectTrait)
class ServiceObjectType extends ObjectType {}

describe("ServiceObjectTrait", () => {
    let instance;

    beforeEach(() => {
        global.broker.createService = jest.fn();
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
});
