import { ContainerObjectType } from "./ContianerObjectType";

describe("ContainerObjectType", () => {
    it("requires objects to be present", () => {
        return expect(ContainerObjectType({ objects: null })).rejects.toEqual({
            objects: ["Objects can't be blank"]
        });
    });
});
