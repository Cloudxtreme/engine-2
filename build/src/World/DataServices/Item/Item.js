"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = (config) => ({
    settings: config,
    name: 'item',
    create(object) {
        return Promise.resolve(() => {
            return this.db.insert({
                name: object.name,
                item_type: object.item_type,
            })
                .into('items');
        });
    },
});
//# sourceMappingURL=Item.js.map