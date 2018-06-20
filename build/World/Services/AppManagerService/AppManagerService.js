"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../Apps/index");
const APPS = {
    Signup: index_1.SignupApp,
    Login: index_1.LoginApp,
    CreateCharacter: index_1.CreateCharacterApp,
    SelectCharacter: index_1.SelectCharacterApp,
};
exports.AppManagerService = (config) => ({
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
