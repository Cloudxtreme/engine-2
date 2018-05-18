"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("../App");
exports.Signup = App_1.App({
    appName: 'Signup',
    initialState: {
        currentStep: 0,
    },
    started() {
        return this.sendStepText();
    },
    handleInput(payload) {
        switch (this.state.getIn('currentStep')) {
            case 0:
                this.state.setIn('username', payload.message);
                this.state.setIn('currentStep', 1);
                break;
            case 1:
                this.state.setIn('password', payload.message);
                this.state.setIn('currentStep', 2);
                break;
            case 2:
                const password = this.state.getIn('password');
                if (payload.message !== password) {
                    this.state.setIn('currentStep', 1);
                    this.sendToScreen('The password and confirmation must match!\n');
                }
                else {
                    this.broker.call('data.player.create', {
                        username: this.state.getIn('username'),
                        password: this.state.getIn('password'),
                    });
                    this.sendToScreen('Signed up!\n');
                    return this.switchApp('Login');
                }
        }
        return this.sendStepText();
    },
    methods: {
        sendStepText() {
            switch (this.state.getIn('currentStep')) {
                case 0:
                    return this.sendToScreen('Choose a username:');
                case 1:
                    return this.sendToScreen('Choose a password:');
                case 2:
                    return this.sendToScreen('Confirm your password:');
            }
        },
    },
});
//# sourceMappingURL=SignupApp.js.map