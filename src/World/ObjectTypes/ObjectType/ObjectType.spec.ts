import { ObjectType } from "./ObjectType";

describe("ObjectType", () => {
    describe("uuid", () => {
        let ot;
        beforeEach(() => {
            ot = ObjectType("SomeObject", (props: any) => props);
        });

        it("sets the uuid if not already set", () => {
            expect(ot().uuid).toBeDefined();
        });

        it("does not set the uuid if already set", () => {
            expect(ot({ uuid: "asdf1234" }).uuid).toEqual("asdf1234");
        });
    });

    describe("key", () => {
        let ot;
        beforeEach(() => {
            ot = ObjectType("SomeObject", (props: any) => props);
        });

        it("sets the key automatically when null", () => {
            const object = ot();
            expect(object.key).toEqual(`some-object:${object.uuid.slice(-5)}`);
        });

        it("does not set the key automatically when manually set", () => {
            expect(ot({ key: "something" }).key).toEqual("something");
        });
    });

    describe("createdAt", () => {
        let ot;
        beforeEach(() => {
            ot = ObjectType("SomeObject", (props: any) => props);
        });

        it("is set when it is null", () => {
            expect(ot("object").createdAt).toBeDefined();
        });

        it("doesn't set createdAt", () => {
            const createdAt = new Date().getTime();
            expect(ot("object", { createdAt }).createdAt).toEqual(createdAt);
        });
    });

    describe("updatedAt", () => {
        let ot;
        beforeEach(() => {
            ot = ObjectType("SomeObject", (props: any) => props);
        });

        it("is set when it is null", () => {
            expect(ot().updatedAt).toBeDefined();
        });

        it("doesn't set updatedAt", () => {
            const updatedAt = new Date().getTime();
            expect(ot({ updatedAt }).updatedAt).toEqual(updatedAt);
        });
    });

    describe("objectTypes", () => {
        let ot;
        beforeEach(() => {
            ot = ObjectType("SomeObject", (props: any) => props);
        });

        it("adds the object type to the objectTypes array", () => {
            expect(ot().objectTypes).toContain("SomeObject");
        });
    })
});
