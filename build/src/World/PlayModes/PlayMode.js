"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StateManager_1 = require("../../StateManager");
exports.PlayMode = (mode) => {
    return (config) => {
        return {
            name: `world.player.${config.uuid}`,
            metadata: Object.assign({}, config),
            created() {
                this.state = new StateManager_1.StateManager(mode.initialState);
            },
            started() {
                return new Promise((resolve) => {
                    mode.started.bind(this)();
                    resolve();
                });
            },
        };
    };
};
//# sourceMappingURL=PlayMode.js.map