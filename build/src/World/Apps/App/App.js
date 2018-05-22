"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const StateManager_1 = require("../../../StateManager");
exports.App = (app) => {
    return (config) => {
        return {
            name: `world.player.${config.uuid}`,
            metadata: Object.assign({}, config),
            dependencies: [`portal.player.${config.uuid}`],
            created() {
                this.logger.debug(`registered on 'world.player.${config.uuid}'`);
                this.state = new StateManager_1.StateManager(app.initialState);
            },
            started() {
                this.logger.debug(`started app '${app.appName}'`);
                return new Promise((resolve) => {
                    app.started.bind(this)();
                    resolve();
                });
            },
            methods: Object.assign({ sendToScreen(message) {
                    return this.broker.call(`portal.player.${config.uuid}.sendToScreen`, Object.assign({}, this.metadata, { message, messageUuid: uuid.v1(), messageCreatedAt: new Date().getTime() / 1000 }));
                },
                switchApp(name) {
                    this.broker.broadcast('world.player.loadApp', Object.assign({}, this.metadata, { app: name }));
                } }, app.methods),
            actions: {
                sendToWorld(ctx) {
                    app.handleInput.bind(this)(ctx.params);
                    return true;
                },
                sendToScreen(ctx) {
                    return this.sendToScreen(ctx.params);
                },
            },
        };
    };
};
//# sourceMappingURL=App.js.map