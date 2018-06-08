import { ObjectType, traits } from "../../ObjectTypes";
import { ContainerObjectTrait } from "./ContainerObjectTrait";

@traits(ContainerObjectTrait)
class ContainerObjectType extends ObjectType {}

describe("ContainerObjectType", () => {
    let instance;

    beforeEach(() => {
        instance = new ContainerObjectType();
    });

    describe("add", () => {
        it("adds the provided object to the container's objects based on the child's key", () => {
            const child = new ContainerObjectType({
                key: "child",
            });
            instance.add(child);
            expect(instance.objects[child.key]).toEqual(
                expect.objectContaining(child),
            );
        });

        it("adds an object to a nested object based on path", () => {
            const child = new ContainerObjectType({
                key: "child",
            });
            const grandChild = new ContainerObjectType({
                key: "grandChild",
            });
            const greatGrandChild = new ContainerObjectType({
                key: "greatGrandChild",
            });
            child.add(grandChild);
            instance.add(child);
            instance.add("child.grandChild", greatGrandChild);
            expect(
                instance.objects.child.objects.grandChild.objects
                    .greatGrandChild,
            ).toEqual(expect.objectContaining(greatGrandChild));
        });

        it("emits an objectAdded event when an object is added", () => {
            const child = new ContainerObjectType({
                key: "child",
            });
            instance.emitter.emit = jest.fn();

            instance.add(child);
            expect(instance.emitter.emit).toHaveBeenCalledWith(
                "objectAdded",
                expect.objectContaining(child),
            );
        });
    });
});
