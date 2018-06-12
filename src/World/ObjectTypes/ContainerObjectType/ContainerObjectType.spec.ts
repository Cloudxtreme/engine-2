import { ContainerObjectType } from "./ContainerObjectType";

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
            instance.emit = jest.fn();

            instance.add(child);
            expect(instance.emit).toHaveBeenCalledWith(
                "objectAdded",
                expect.objectContaining(child),
            );
        });
    });

    describe("serialize", () => {
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
            expect(instance.serialize()).toEqual(
                expect.objectContaining({
                    key: instance.key,
                    objects: {
                        child: expect.objectContaining({
                            key: child.key,
                            objects: {
                                grandChild: expect.objectContaining({
                                    key: grandChild.key,
                                    objects: {
                                        greatGrandChild: expect.objectContaining(
                                            {
                                                key: greatGrandChild.key,
                                            },
                                        ),
                                    },
                                }),
                            },
                        }),
                    },
                }),
            );
        });
    });
});
