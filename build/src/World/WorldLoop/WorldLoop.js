"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Apps_1 = require("../Apps");
const APPS = {
    Signup: Apps_1.Signup,
    Login: Apps_1.Login,
};
exports.WorldLoop = (config) => {
    return {
        name: 'world.loop',
        metadata: Object.assign({}, config),
        events: {
            'player.connected': function (payload) {
                this.broker.broadcast('world.player.loadApp', Object.assign({}, payload, { app: 'Login' }));
            },
            'player.disconnected': function (payload) {
                const service = this.broker.getLocalService(`world.player.${payload.uuid}`);
                if (service) {
                    this.broker.destroyService(service);
                }
            },
            'world.player.loadApp': function (payload) {
                const currentApp = this.broker.getLocalService(`world.player.${payload.uuid}`);
                if (currentApp) {
                    this.broker.destroyService(currentApp);
                }
                const service = Apps_1.App(APPS[payload.app])(payload);
                this.broker.createService(service);
            },
        },
        methods: {
            loadApp(metadata, app) {
                this.broker.broadcast('world.player.loadApp', Object.assign({}, metadata, { app }));
            },
        },
    };
};
//# sourceMappingURL=WorldLoop.js.map