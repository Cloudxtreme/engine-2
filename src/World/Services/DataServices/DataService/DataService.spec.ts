import {Service, ServiceBroker} from "moleculer";

import { DataService } from "./DataService";

jest.mock("knex");
const broker = new ServiceBroker();

import * as Knex from "knex";

// tslint:disable-next-line
require( "../../../../../example/config/config");

describe("DataService", () => {
    describe("onCreate", () => {
        it("it creates a connection to the database", () => {
            new Service(broker, DataService()).created();
            expect(Knex).toHaveBeenCalledWith(
                // tslint:disable-next-line:non-literal-require
                require(`${process.env.GAME_ROOT}/config/knexfile.js`),
            );
        });
    });
});
