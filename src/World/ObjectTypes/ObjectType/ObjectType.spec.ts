import * as lodash from "lodash";

import { compose, ObjectType } from "./ObjectType";

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
            constructor(traits: any) {
                super(traits);
                mockFunction(traits);
                this.foo = "bar";
                this.baz = "bar";
            }
        }

        @compose(OneObjectType)
        class TwoObjectType extends ObjectType {
            constructor(traits: any) {
                super(traits);
                this.baz = "baz";
            }
        }

        beforeEach(() => {
            instance = new TwoObjectType({ foo: "bar" });
        });

        it("calls super of inherited object types", () => {
            expect(mockFunction).toHaveBeenCalledWith({ foo: "bar" });
        });

        it("maps traits from parent types", () => {
            expect(instance.foo).toEqual("bar");
        });

        it("does not override properties defined later types", () => {
            expect(instance.baz).toEqual("baz");
        });

        it("does not change the objectType", () => {
            expect(instance.objectType).toEqual("TwoObjectType");
        });
    });
});
