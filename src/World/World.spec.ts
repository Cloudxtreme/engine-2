import { World } from "./World";

describe("World", () => {
    it("sets the nodeID", () => {
        expect(World().nodeID).toEqual("lucid-mud");
    });

    describe("transporter", () => {
        it("sets a default", () => {
            expect(World().transporter).toContainEqual("nats://localhost:4222");
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
});
