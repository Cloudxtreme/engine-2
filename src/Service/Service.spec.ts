import * as Bluebird from "bluebird";
import { ServiceBroker } from "moleculer";
import * as R from "ramda";

import {  action, define, dependency, IServiceConfig, method, onCreate, onStart, onStop  } from "./Service";

describe("Service", () => {
    describe("define", () => {
        it("creates a service definition function", () => {
            expect(typeof define("service", () => {})).toEqual(
                "function",
            );
        });

        it("sets the service name correctly", () => {
            expect(
                define("service", (config: IServiceConfig) => config)(
                    {},
                ),
            ).toEqual(expect.objectContaining({ name: "services.service" }));
        });

        it("correctly chains multiple service definitions", () => {
            const mock1 = jest.fn();
            const mock2 = jest.fn();
            const mock3 = jest.fn();
            const mock4 = jest.fn();
            const def1 = define(
                "service",
                method("mock1", mock1),
                action("mock3", mock3),
            );
            const def2 = define(
                "service1",
                def1,
                method("mock2", mock2),
                action("mock4", mock4),
            );

            expect(def2()).toEqual(
                expect.objectContaining({
                    name: "services.service1",
                    methods: {
                        mock1,
                        mock2,
                    },
                    actions: {
                        mock3,
                        mock4,
                    },
                }),
            );
        });
    });

    describe("onCreate", () => {
        it("sets the base function for created if not set", () => {
            const mockFunction = jest.fn();
            onCreate(mockFunction)({}).created();
            expect(mockFunction).toHaveBeenCalled();
        });

        it("chains multiple on creates together", () => {
            const mock1 = jest.fn();
            const mock2 = jest.fn();
            R.pipe(
                onCreate(mock1),
                onCreate(mock2),
            )({}).created("foo");

            expect(mock1).toHaveBeenCalledWith("foo");
            expect(mock2).toHaveBeenCalledWith("foo");
        });
    });

    describe("onStart", () => {
        it("sets the base function for started if not set", () => {
            const mockFunction = jest.fn(() => Bluebird.resolve());

            return onStart(mockFunction)({})
                .started()
                .then(() => {
                    return expect(mockFunction).toHaveBeenCalled();
                });
        });

        it("chains multiple on creates together", () => {
            const mock1 = jest.fn(() => Bluebird.resolve());
            const mock2 = jest.fn(() => Bluebird.resolve());
            R.pipe(
                onStart(mock1),
                onStart(mock2),
            )({})
                .started()
                .then(() => {
                    expect(mock1).toHaveBeenCalledWith("foo");
                    expect(mock2).toHaveBeenCalledWith("foo");
                });
        });
    });

    describe("onStop", () => {
        it("sets the base function for stopped if not set", () => {
            const mockFunction = jest.fn(() => Bluebird.resolve());
            onStop(mockFunction)({})
                .stopped()
                .then(() => {
                    expect(mockFunction).toHaveBeenCalled();
                });
        });

        it("chains multiple on creates together", () => {
            const mock1 = jest.fn(() => Bluebird.resolve());
            const mock2 = jest.fn(() => Bluebird.resolve());
            R.pipe(
                onStop(mock1),
                onStop(mock2),
            )({})
                .stopped()
                .then(() => {
                    expect(mock1).toHaveBeenCalledWith("foo");
                    expect(mock2).toHaveBeenCalledWith("foo");
                });
        });
    });

    describe("method", () => {
        it("sets up the method on ervice.methods", () => {
            const mock = jest.fn();
            method("test", mock)({}).methods.test();
            expect(mock).toHaveBeenCalled();
        });
    });

    describe("dependency",  () => {
        it("appends the dependency", () => {
            expect(dependency("foo")({}).dependencies).toEqual(
                expect.arrayContaining(["foo"]),
            );
        });
    });
});
