"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Character_1 = require("../Character");
const OBJECT_PROTOTYPES = {
    Character: Character_1.Character,
};
exports.ObjectService = () => ({
    name: 'world.objects',
    actions: {
        create(object) {
            const newObject = Object(OBJECT_PROTOTYPES[object.item_type]());
        },
    },
});
//# sourceMappingURL=ObjectService.js.map