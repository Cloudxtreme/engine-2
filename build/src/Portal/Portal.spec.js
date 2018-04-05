"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Portal_1 = require("./Portal");
describe('Portal', () => {
    let portal;
    beforeEach(() => {
        portal = new Portal_1.Portal();
    });
    describe('#beforeStart', () => {
        it('concats the function passed to the beforeStartHooks property', () => {
            portal.beforeStart(() => true);
        });
    });
});
//# sourceMappingURL=Portal.spec.js.map