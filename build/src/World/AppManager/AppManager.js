"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Apps_1 = require("../Apps");
const APPS = {
    Signup: Apps_1.Signup,
    Login: Apps_1.Login,
    CreateCharacter: Apps_1.CreateCharacter,
    SelectCharacter: Apps_1.SelectCharacter,
};
exports.AppManager = (config) => ({
    name: 'world.appManager',
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
            const service = APPS[payload.app](payload);
            if (currentApp) {
                this.broker.destroyService(currentApp)
                    .then(() => {
                    this.broker.createService(service);
                });
            }
            else {
                this.broker.createService(service);
            }
        },
    },
    methods: {
        loadApp(metadata, app) {
            this.broker.broadcast('world.player.loadApp', Object.assign({}, metadata, { app }));
        },
    },
});
//# sourceMappingURL=AppManager.js.map