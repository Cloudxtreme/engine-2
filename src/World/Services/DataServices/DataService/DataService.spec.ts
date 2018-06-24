import {Service, ServiceBroker} from "moleculer";

import { DataService } from "./DataService";

const broker = new ServiceBroker();
// tslint:disable-next-line
require( "../../../../../example/config/config");

describe("DataService", () => {
    describe("onCreate", () => {
        it("it creates a connection to the database", () => {
            const service = new Service(broker, DataService());
            service.created();
            expect(service.knex).toBeDefined();

            return service.knex.destroy();
        });
    });
});
