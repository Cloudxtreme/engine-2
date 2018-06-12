import * as lodash from "lodash";

import { compose, ObjectType, TObjectConstraints } from "./ObjectType";

describe("ObjectType", () => {
    let emptyInstance;
    let fullInstance;

    beforeEach(() => {
        emptyInstance = new class ObjectClassObjectType extends ObjectType {}();
        fullInstance = new class ObjectClassObjectType extends ObjectType {}({
            uuid: "asdf1234",
            key: "1234asdf",
        });
    });

    it("sets uuid if empty", () => {
        expect(emptyInstance.uuid).toBeDefined();
    });

    it("should not set the uuid if already set", () => {
        expect(fullInstance.uuid).toEqual("asdf1234");
    });

    it("sets objectType", () => {
        expect(emptyInstance.objectType).toEqual("ObjectClassObjectType");
    });

    it("sets the key if empty", () => {
        expect(emptyInstance.key).toEqual(
            `${lodash.kebabCase(
                emptyInstance.objectType.replace("ObjectType", ""),
            )}:${emptyInstance.uuid.slice(-5, -1)}`,
        );
    });

    it("does not set the key if already present", () => {
        expect(fullInstance.key).toEqual("1234asdf");
    });

    describe("compose", () => {
        let instance;
        const mockFunction = jest.fn();

        class OneObjectType extends ObjectType {
            static readonly schema: TObjectConstraints = {
                foo: {
                    presence: true,
                },
            };

            initialize(props: any) {
                mockFunction(props);
                this.foo = "bar";
                this.baz = "bar";
                this.test = jest.fn();
            }
        }

        // tslint:disable-next-line:max-classes-per-file
        @compose(OneObjectType)
        class TwoObjectType extends ObjectType {
            static readonly schema: TObjectConstraints = {
                baz: {
                    presence: true,
                },
            };

            initialize(props: any) {
                this.baz = "baz";
            }

            test() {}
        }

        beforeEach(() => {
            instance = new TwoObjectType({ foo: "bar" });
        });

        it("calls initializers of inherited object types", () => {
            expect(mockFunction).toHaveBeenCalledWith({ foo: "bar" });
        });

        it("maps traits from parent types", () => {
            expect(instance.foo).toEqual("bar");
        });

        it("does not override properties defined later types", () => {
            expect(instance.baz).toEqual("baz");
        });

        it("doesn't override functions higher up in the chain", () => {
            instance.test();
            expect(instance.test).toHaveBeenCalled();
        });

        it("does not change the objectType", () => {
            expect(instance.objectType).toEqual("TwoObjectType");
        });

        it("merges the schemas of previous types", () => {
            expect(TwoObjectType.schema).toEqual(
                expect.objectContaining({
                    foo: { presence: true },
                    baz: { presence: true },
                }),
            );
        });

        it("correctly serializes mult-inheritance objects", () => {
            expect(instance.serialize()).toEqual(
                expect.objectContaining({
                    uuid: instance.uuid,
                    key: instance.key,
                    objectType: instance.objectType,
                    foo: instance.foo,
                    baz: "baz", // make sure we are getting TwoObjectType's baz
                }),
            );
        });
    });

    describe("serialize", () => {
        it("should serialize the instance", () => {
            expect(fullInstance.serialize()).toEqual(
                expect.objectContaining({
                    key: fullInstance.key,
                    objectType: fullInstance.objectType,
                    uuid: fullInstance.uuid,
                }),
            );
        });
    });
});
