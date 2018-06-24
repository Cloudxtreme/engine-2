import * as Knex from "knex";
import { Service, ServiceBroker } from "moleculer";

import { ISnapshot, SnapshotDataService } from "./SnapshotDataService";

const broker = new ServiceBroker();

let service;
let snapshot;

// tslint:disable
require("../../../../../example/config/config");
const knex = Knex(require(`${process.env.GAME_ROOT}/config/knexfile`));
// tslint:enable

describe("SnapshotDataService", () => {
    describe("findLatest", () => {
        beforeEach(() => {
            service = new Service(broker, SnapshotDataService());
            service.created();

            return knex
                .insert({
                    data: { a: 1, b: 2, c: 3 },
                })
                .into("snapshots")
                .then(() =>
                    knex
                        .select("*")
                        .from("snapshots")
                        .orderBy("created_at", "desc")
                        .limit(1),
                )
                .then((rows: ISnapshot[]) => {
                    snapshot = rows[0];
                });
        });

        afterEach(() => {
            return knex
                .from("snapshots")
                .del()
                .finally(() => {
                    service.knex.destroy();
                });
        });

        afterAll(() => {
            knex.destroy();
        });

        it("finds the most recent snapshot", () => {
            return service.findLatest().then((latest: ISnapshot) => {
                expect(latest.data).toEqual(
                    expect.objectContaining({
                        a: 1,
                        b: 2,
                        c: 3,
                    }),
                );
                expect(latest.created_at).toBeDefined();
            });
        });
    });
});
