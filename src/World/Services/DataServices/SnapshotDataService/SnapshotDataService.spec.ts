import * as Bluebird from "bluebird";
import * as Knex from "knex";
import { Service, ServiceBroker } from "moleculer";

import { ISnapshot, SnapshotDataService } from "./SnapshotDataService";

// tslint:disable
require("../../../../../example/config/config");
const knex = Knex(require(`${process.env.GAME_ROOT}/config/knexfile`));
// tslint:enable

const broker = new ServiceBroker();
broker.createService(SnapshotDataService());

const service = broker.getLocalService("services.snapshots");
let snapshot;

describe("SnapshotDataService", () => {
    afterAll(() => {
        knex.destroy();
        broker.stop();
    });

    describe("findLatest", () => {
        beforeEach(() => {
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

    describe("create", () => {
        it("creates a snapshot and returns it", () => {
            const data = { a: 3, b: 2, c: 1 };

            return service.create(data).then((snap: ISnapshot) => {
                expect(snap.data).toEqual(expect.objectContaining(data));
                expect(snap.id).toBeDefined();
                expect(snap.created_at).toBeDefined();
            });
        });
    });

    describe("actions", () => {
        describe("findLatest", () => {
            it("calls findLatest method", () => {
                service.findLatest = jest.fn(Bluebird.resolve);

                return broker
                    .call("services.snapshots.findLatest")
                    .then(() => expect(service.findLatest).toHaveBeenCalled());
            });
        });

        describe("create", () => {
            it("calls the create method", () => {
                service.create = jest.fn(Bluebird.resolve);

                return broker
                    .call("services.snapshots.create", { a: 1, b: 1, c: 1 })
                    .then(() =>
                        expect(service.create).toHaveBeenCalledWith(
                            expect.objectContaining({ a: 1, b: 1, c: 1 }),
                        ),
                    );
            });
        });
    });
});
