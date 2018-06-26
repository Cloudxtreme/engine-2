import { addObject, ContainerObjectType } from "./ContainerObjectType";

describe("ContainerObjectType", () => {
    it("is of type ContainerObject", () => {
        expect(ContainerObjectType().objectTypes).toContain("ContainerObject");
    });

    it("sets the children object", () => {
        expect(typeof ContainerObjectType().children).toEqual("object");
    });
});

describe("addObject", () => {
    let parent;
    let child;
    beforeEach(() => {
        parent = ContainerObjectType();
        child = ContainerObjectType();
    });

    // tslint:disable-next-line:no-invalid-template-strings
    it("adds the child object to the paren't children", () => {
        expect(addObject(child, parent).children[child.key].key).toEqual(child.key);
    });

    it("throws an error when attempting to add to a non container object", () => {
        expect(() => addObject(child, {})).toThrowError("Object is not of type 'ContainerObject'")
    });
});
