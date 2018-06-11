"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash = require("lodash");
const ObjectType_1 = require("./ObjectType");
describe("ObjectType", () => {
    let emptyInstance;
    let fullInstance;
    beforeEach(() => {
        emptyInstance = new class ObjectClassObjectType extends ObjectType_1.ObjectType {
        }();
        fullInstance = new class ObjectClassObjectType extends ObjectType_1.ObjectType {
        }({
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
        expect(emptyInstance.key).toEqual(`${lodash.kebabCase(emptyInstance.objectType.replace("ObjectType", ""))}:${emptyInstance.uuid.slice(-5, -1)}`);
    });
    it("does not set the key if already present", () => {
        expect(fullInstance.key).toEqual("1234asdf");
    });
    describe("compose", () => {
        let instance;
        const mockFunction = jest.fn();
        class OneObjectType extends ObjectType_1.ObjectType {
            constructor(traits) {
                super(traits);
                mockFunction(traits);
                this.foo = "bar";
                this.baz = "bar";
                this.test = jest.fn();
            }
        }
        let TwoObjectType = class TwoObjectType extends ObjectType_1.ObjectType {
            constructor(traits) {
                super(traits);
                this.baz = "baz";
            }
            test() { }
        };
        TwoObjectType = tslib_1.__decorate([
            ObjectType_1.compose(OneObjectType),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], TwoObjectType);
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
        it("doesn't override functions higher up in the chain", () => {
            instance.test();
            expect(instance.test).toHaveBeenCalled();
        });
        it("does not change the objectType", () => {
            expect(instance.objectType).toEqual("TwoObjectType");
        });
    });
});
//# sourceMappingURL=ObjectType.spec.js.map