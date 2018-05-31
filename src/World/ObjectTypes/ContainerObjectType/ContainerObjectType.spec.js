import { ContainerObjectType } from "./ContianerObjectType";
import { combine } from "../ObjectType";

const mockFunction = jest.fn();

describe("ContainerObjectType", () => {
    it("requires objects to be present", () => {
        return expect(ContainerObjectType({ objects: null })).rejects.toEqual({
            objects: ["Objects can't be blank"]
        });
    });

    it("inherits EventedObjectTypeTraits", () => {
        return ContainerObjectType().then(traits =>
            expect(traits.inherits("EventedObjectType")).toBeTruthy()
        );
    });

    describe("addObject", () => {
        let BaseObjectType = traits => traits;
        BaseObjectType = combine(BaseObjectType);

        it("adds the given object to the container", () => {
            return BaseObjectType().then(base => {
                return ContainerObjectType().then(container => {
                    container.addObject(base);
                    expect(container.objects[base.key]).toEqual(expect.objectContaining(base));
                });
            });
        });

        it("calls the object.added event with the added object", () => {
            return BaseObjectType().then(base => {
                return ContainerObjectType().then(container => {
                    container.on("object.added", object => {
                        mockFunction(object);
                    });
                    container.addObject(base);
                    expect(mockFunction).toHaveBeenCalledWith(expect.objectContaining(base));
                });
            });
        });

        it("calls the object.addedToDescendant on the parent container", () => {
            return ContainerObjectType({ key: "ancestor" }).then(ancestorContainer => {
                return BaseObjectType().then(base => {
                    return ContainerObjectType({ key: "parent" }).then(parent => {
                        ancestorContainer.on("object.addedToDescendant", ({ key, object }) => {
                            mockFunction(key, object);
                        });
                        ancestorContainer.addObject(parent);
                        parent.addObject(base);
                        expect(mockFunction).toHaveBeenCalledWith(
                            `parent.${base.key}`,
                            expect.objectContaining(base)
                        );
                    });
                });
            });
        });
    });
});
