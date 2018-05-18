"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("../App");
exports.LoginApp = App_1.App({
    appName: 'Login',
    initialState: {
        currentStep: 0,
    },
    started() {
        this.logger.debug(`received connection on ${this.metadata.remoteAddress}'`);
        this.sendNextStep();
    },
    handleInput(payload) {
        const currentStep = this.state.getIn('currentStep');
        switch (currentStep) {
            case 1:
                if (payload.message === '1') {
                    this.switchApp('SignupApp');
                    break;
                }
                if (payload.message === '2') {
                    this.broker.call(`portal.player.${this.metadata.uuid}.disconnect`);
                    break;
                }
                this.state.setIn('currentStep', 2);
                this.state.setIn('username', payload.message);
                return this.sendToScreen('Enter your password:\n');
            case 2:
                const username = this.state.getIn('username');
                this.broker.call('data.player.authenticate', { username, password: payload.message })
                    .then((id) => {
                    if (id) {
                        this.metadata.playerId = id;
                        this.switchApp('SelectCharacterApp');
                    }
                    else {
                        this.sendToScreen('Invalid credentials\n');
                        this.state.setIn('currentStep', 0);
                        this.sendNextStep();
                    }
                });
        }
        return this.sendNextStep();
    },
    methods: {
        sendNextStep() {
            const currentStep = this.state.getIn('currentStep');
            switch (currentStep) {
                case 0:
                    this.state.setIn('currentStep', 1);
                    this.sendToScreen('Enter your username or select an option:\n' +
                        '  1) Create an account\n' +
                        '  2) Quit\n');
            }
        },
    },
});
//# sourceMappingURL=LoginApp.js.map