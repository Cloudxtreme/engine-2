import { Service, ServiceBroker, ServiceSchema } from "moleculer";

import { World } from "./World";

const broker = new ServiceBroker();

describe("World", () => {
    beforeEach(() => {
        broker.createService = jest.fn();
    });

    it("sets the nodeID", () => {
        expect(World().nodeID).toEqual("lucid-mud");
    });

    describe("transporter", () => {
        it("sets a default", () => {
            expect(World().transporter).toEqual("nats://localhost:4222");
        });

        it("can be configured", () => {
            expect(
                World({ transporter: "redis://localhost" }).transporter,
            ).toEqual("redis://localhost");
        });
    });

    it("sets the logger", () => {
        expect(World().logger).toEqual(console);
    });

    describe("logLevel", () => {
        it("sets the default to debug", () => {
            expect(World().logLevel).toEqual("debug");
        });

        it("can be configured", () => {
            expect(World({ logLevel: "info" }).logLevel).toEqual("info");
        });
    });

    describe("created", () => {
        it("calls the onCreate callback", () => {
            const mockFunction = jest.fn();
            expect(World({ onCreate: mockFunction }).created(broker));
        });

        it("allows startService to be called in onCreate", () => {
            const mockServiceSchema: ServiceSchema = {
                name: "service",
            };
            World({
                onCreate() {
                    this.createService(mockServiceSchema);
                },
            }).created(broker);
            expect(broker.createService).toBeCalledWith(mockServiceSchema);
        });
    });

    describe("started", () => {
        it("calls the onStart callback", () => {
            const mockFunction = jest.fn();
            expect(World({ onStart: mockFunction }).started(broker));
        });

        it("allows startService to be called in onStart", () => {
            const mockServiceSchema: ServiceSchema = {
                name: "service",
            };
            World({
                onStart() {
                    this.createService(mockServiceSchema);
                },
            }).started(broker);
            expect(broker.createService).toBeCalledWith(mockServiceSchema);
        });
    });
});
