import { addEventHandler, ServiceObjectType } from "./ServiceObjectType";

describe("ServiceObjectType", () => {
    it("is of type ServiceObjectType", () => {
        expect(ServiceObjectType().objectTypes).toContain("ServiceObject");
    });
});

describe("addEventHandler", () => {
    it("adds the event handler and script", () => {
        expect(addEventHandler("event", "listener")({}).events).toEqual(expect.objectContaining({event: "listener"}));
    });
});
