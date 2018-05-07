"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const index_1 = require("../../../StateManager/index");
exports.App = (app) => {
    return (config) => {
        return {
            name: `world.player.${config.uuid}`,
            metadata: Object.assign({}, config),
            dependencies: [`portal.player.${config.uuid}`],
            created() {
                this.state = new index_1.StateManager(app.initialState);
            },
            started() {
                return new Promise((resolve) => {
                    app.started.bind(this)();
                    resolve();
                });
            },
            methods: Object.assign({}, app.methods, { sendToScreen(message) {
                    return this.broker.call(`portal.player.${config.uuid}.sendToScreen`, Object.assign({}, this.metadata, { message, messageUuid: uuid.v1(), messageCreatedAt: new Date().getTime() / 1000 }));
                } }, app.methods),
            actions: {
                sendToWorld(ctx) {
                    app.handleInput.bind(this)(ctx.params);
                    return true;
                },
            },
        };
    };
};
//# sourceMappingURL=App.js.map