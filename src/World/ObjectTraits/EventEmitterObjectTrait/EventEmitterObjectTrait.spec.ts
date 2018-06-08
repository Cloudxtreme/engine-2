import {  ObjectType, traits } from "../../ObjectTypes";
import { EventEmitterObjectTrait } from "./EventEmitterObjectTrait";

@traits(EventEmitterObjectTrait)
class EventedObjectType extends ObjectType {}

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
});
