import { Service, ServiceBroker } from "moleculer";
import * as path from "path";

import {IObjectType} from "../ObjectType";
import { WorldObjectType } from "./WorldObjectType";

global.broker = new ServiceBroker();

describe("WorldObjectType", () => {
    let instance: WorldObjectType;

    beforeEach(() => {
        instance = new WorldObjectType();
    });

    it("should have the key 'world'", () => {
        expect(instance.key).toEqual("world");
    });

    describe("service", () => {
        let service;
        beforeEach(() => {
            service = new Service(global.broker, instance._serviceDefinition());
        });

        describe("objectTypePaths", () => {
            it("includes the library path", () => {
                expect(service.objectTypePaths).toEqual(
                    expect.arrayContaining([path.resolve(__dirname, "..")]),
                );
            });
        });

        describe("OBJECT_TYPES", () => {
            it("registers OBJECT_TYPES", () => {
                // tslint:disable-next-line:no-string-literal
                expect(service.OBJECT_TYPES).toHaveProperty("WorldObjectType");
            });
        });

        describe("methods", () => {
            describe("saveSnapshot", () => {
                beforeEach(() => {
                    service.broker.call = jest.fn(() =>
                        Promise.resolve({ id: 1, updatedAt: new Date() }),
                    );
                    service.broker.broadcast = jest.fn();
                });

                it("calls the 'data.snapshots' broker to save the snapshot", () => {
                    return service.saveSnapshot().then(() => {
                        expect(service.broker.call).toHaveBeenCalledWith(
                            "data.snapshot.create",
                            instance.serialize(),
                        );
                    });
                });

                it("broadcasts the 'world.snapshot.created' event", () => {
                    return service.saveSnapshot().then((data: IObjectType) => {
                        expect(service.broker.broadcast).toHaveBeenCalledWith(
                            "world.snapshot.created",
                            { id: data.id, updatedAt: data.updatedAt },
                        );
                    });
                });
            });
        });
    });
});
