import * as Bluebird from "bluebird";
import { ServiceBroker } from "moleculer";

import { SnapshotDataService } from "../DataServices/SnapshotDataService";
import { StateService } from "./StateService";

const broker = new ServiceBroker();

describe("StateService", () => {
    it("sets the name", () => {
        expect(StateService()).toEqual(expect.objectContaining({ name: "services.state" }));
    });

    describe("created", () => {
        it("creates a redis connection", () => {
            const serviceDefinition = StateService();
            serviceDefinition.started = jest.fn();
            const service = broker.createService(serviceDefinition);
            expect(service.redis).toBeDefined();
        });
    });
});
