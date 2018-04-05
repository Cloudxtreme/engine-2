"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Listener_1 = require("./Listener");
describe('Listener', () => {
    let listener;
    beforeEach(() => {
        listener = new Listener_1.Portal.Listener();
    });
    describe('#beforeStart', () => {
        it('concats the function passed to the beforeStartHooks property', () => {
            const callback = () => true;
            listener.beforeStart(callback);
            expect(listener.beforeStartHooks).toEqual([callback]);
        });
    });
    describe('#afterStart', () => {
        it('concats the function passed to the beforeStartHooks property', () => {
            const callback = () => true;
            listener.afterStart(callback);
            expect(listener.afterStartHooks).toEqual([callback]);
        });
    });
});
//# sourceMappingURL=Listener.spec.js.map