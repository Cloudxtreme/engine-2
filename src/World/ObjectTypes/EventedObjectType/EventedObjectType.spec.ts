import { EventedObjectType } from "./";

describe("EventedObject", () => {
    let instance;

    beforeEach(() => {
        instance = new EventedObjectType();
    });

    describe("on", () => {
        beforeEach(() => {
            //tslint:disable-next-line:no-string-literal
            instance["emitter"].on = jest.fn();
        });

        it("sets the callback on the emitter", () => {
            const cb = jest.fn();
            instance.on("anEvent", cb);
            //tslint:disable-next-line:no-string-literal
            expect(instance["emitter"].on).toHaveBeenCalledWith("anEvent", cb);
        });
    });

    describe("emit", () => {
        beforeEach(() => {
            //tslint:disable-next-line:no-string-literal
            instance["emitter"].emit = jest.fn();
        });

        it("emits the event to the arguments", () => {
            instance.emit("test", "foo");
            //tslint:disable-next-line:no-string-literal
            expect(instance["emitter"].emit).toHaveBeenCalledWith(
                "test",
                "foo",
            );
        });
    });
});
