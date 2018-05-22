"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("../App");
exports.CreateCharacter = App_1.App({
    appName: 'CreateCharacter',
    initialState: {
        currentStep: 0,
    },
    handleInput(payload) {
        const currentStep = this.state.getIn('currentStep');
        switch (currentStep) {
            case 1:
                this.broker.call('world.state.createAndStore', {
                    object_type: 'Character',
                    key: payload.message,
                    player_id: this.metadata.playerId,
                });
        }
        return this.sendNextStep();
    },
    started() {
        return this.sendNextStep();
    },
    methods: {
        sendNextStep() {
            const currentStep = this.state.getIn('currentStep');
            switch (currentStep) {
                case 0:
                    this.state.setIn('currentStep', 1);
                    this.sendToScreen('Name your character:\n');
            }
        },
    },
});
//# sourceMappingURL=CreateCharacter.js.map