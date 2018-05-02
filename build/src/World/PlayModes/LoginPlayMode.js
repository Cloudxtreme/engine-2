"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PlayMode_1 = require("./PlayMode");
class LoginPlayMode extends PlayMode_1.PlayMode {
    constructor() {
        super(...arguments);
        this.initialState = {
            currentStep: 1,
        };
    }
    inputHandler(inputContext) {
        return new Promise((resolve) => {
            switch (this.state.getIn('currentStep')) {
                case (1):
                    this.state.setIn('username', inputContext.message);
                    resolve();
                    break;
                case (2):
                    resolve();
                    break;
                default:
                    this.logger.error('invalid state');
            }
        });
    }
    onLoad() {
        this.sendToScreen('Lucid Mud');
        this.sendToScreen('Username:');
    }
}
exports.LoginPlayMode = LoginPlayMode;
//# sourceMappingURL=LoginPlayMode.js.map