import * as Bluebird from "bluebird";
import { ServiceBroker } from "moleculer";
import * as R from "ramda";

import { IServiceConfig, Service } from "./Service";

const broker = new ServiceBroker();

describe("Service", () => {
    describe("define", () => {
        it("creates a service definition function", () => {
            expect(typeof Service.define("service", () => {})).toEqual(
                "function",
            );
        });

        it("sets the service name correctly", () => {
            expect(
                Service.define("service", (config: IServiceConfig) => config)(
                    {},
                ),
            ).toEqual(expect.objectContaining({ name: "services.service" }));
        });
    });

    describe("onCreate", () => {
        it("sets the base function for created if not set", () => {
            const mockFunction = jest.fn();
            Service.onCreate(mockFunction)({}).created(broker);
            expect(mockFunction).toHaveBeenCalled();
        });

        it("chains multiple on creates together", () => {
            const mock1 = jest.fn();
            const mock2 = jest.fn();
            R.pipe(
                Service.onCreate(mock1),
                Service.onCreate(mock2),
            )({}).created("foo");

            expect(mock1).toHaveBeenCalledWith("foo");
            expect(mock2).toHaveBeenCalledWith("foo");
        });
    });

    describe("onStart", () => {
        it("sets the base function for started if not set", () => {
            const mockFunction = jest.fn(() => Bluebird.resolve());

            return Service.onStart(mockFunction)({})
                .started()
                .then(() => {
                    return expect(mockFunction).toHaveBeenCalled();
                });
        });

        it("chains multiple on creates together", () => {
            const mock1 = jest.fn(() => Bluebird.resolve());
            const mock2 = jest.fn(() => Bluebird.resolve());
            R.pipe(
                Service.onStart(mock1),
                Service.onStart(mock2),
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
            Service.onStop(mockFunction)({})
                .stopped()
                .then(() => {
                    expect(mockFunction).toHaveBeenCalled();
                });
        });

        it("chains multiple on creates together", () => {
            const mock1 = jest.fn(() => Bluebird.resolve());
            const mock2 = jest.fn(() => Bluebird.resolve());
            R.pipe(
                Service.onStop(mock1),
                Service.onStop(mock2),
            )({})
                .stopped()
                .then(() => {
                    expect(mock1).toHaveBeenCalledWith("foo");
                    expect(mock2).toHaveBeenCalledWith("foo");
                });
        });
    });
});
