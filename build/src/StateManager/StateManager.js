"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
class StateManager {
    constructor(initialState) {
        this.state = immutable_1.fromJS(initialState);
    }
    getIn(key) {
        return this.state.getIn(key.split('.'));
    }
    setIn(key, value) {
        this.state = this.state.setIn(key.split('.'), immutable_1.fromJS(value));
    }
}
exports.StateManager = StateManager;
//# sourceMappingURL=StateManager.js.map