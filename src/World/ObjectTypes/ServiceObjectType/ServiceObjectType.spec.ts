import { ServiceObjectType } from "./ServiceObjectType";

describe("ServiceObjectType", () => {
    it("is of type ServiceObjectType", () => {
        expect(ServiceObjectType().objectTypes).toContain("ServiceObject");
    });
});
