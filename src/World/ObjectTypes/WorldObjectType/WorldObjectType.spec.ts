import { WorldObjectType } from "./WorldObjectType";

describe("WorldObjectType", () => {
    it("is of a 'ServiceObjectType'", () => {
        expect(WorldObjectType().objectTypes).toContain("ServiceObject");
    });

    it("is of a 'ContainerObjectType", () => {
        expect(WorldObjectType().objectTypes).toContain("ContainerObject");
    });
});