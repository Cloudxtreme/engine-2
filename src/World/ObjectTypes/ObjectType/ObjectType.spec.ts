import * as lodash from "lodash";

import ObjectType from "./ObjectType";

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

    it("sets the key empty", () => {
        expect(emptyInstance.key).toEqual(
            `${lodash.kebabCase(
                emptyInstance.objectType.replace("ObjectType", ""),
            )}:${emptyInstance.uuid.slice(-5, -1)}`,
        );
    });

    it("does not set the key if already present", () => {
        expect(fullInstance.key).toEqual("1234asdf");
    });
});
