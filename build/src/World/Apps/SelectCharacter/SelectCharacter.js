"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("../App");
exports.SelectCharacter = App_1.App({
    appName: 'SelectCharacter',
    started() {
        this.broker.call('data.object.findForPlayer', {
            player_id: this.metadata.playerId,
            object_type: 'Character',
        })
            .then((characters) => {
            if (characters.length > 0) {
                const chars = characters.map((character, index) => {
                    return {
                        name: character.key,
                        template: `   ${index + 1}. ${character.key}\n`,
                        character,
                    };
                });
                let template = "Choose your character or type 'create' to create a new one:\n";
                chars.forEach((character) => {
                    template += character.template;
                });
                return this.sendToScreen(template);
            }
            else {
                return this.switchApp('CreateCharacter');
            }
        });
    },
    handleInput(payload) {
        if (payload.message === 'create') {
            return this.switchApp('CreateCharacter');
        }
        return this.broker.call('data.object.findForPlayer', {
            player_id: this.metadata.playerId,
            object_type: 'Character',
        })
            .then((characters) => {
            if (characters[payload.message - 1]) {
                this.sendToScreen(`You selected '${payload.message}'\n`);
            }
            else if (payload.message === 'create') {
                return this.switchApp('CreateCharacter');
            }
            else {
                this.sendToScreen('The selection was invalid.\n');
                return this.started();
            }
        });
    },
});
//# sourceMappingURL=SelectCharacter.js.map