"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectType_1 = require("../ObjectType");
class ServiceObjectType extends ObjectType_1.ObjectType {
    constructor() {
        super(...arguments);
        this.methods = {};
        this.actions = {};
        this.events = {};
    }
    initialize(traits) {
        this.created = traits.created;
        this.started = traits.started;
        this.service = global.broker.createService(this._serviceDefinition());
    }
    get logger() {
        return this.service.logger;
    }
    _serviceDefinition() {
        return {
            name: this.key,
            methods: Object.assign({}, this.methods),
            actions: Object.assign({}, this.actions),
            events: Object.assign({}, this.events),
            created: this.created,
            started: this.started,
        };
    }
}
exports.ServiceObjectType = ServiceObjectType;
//# sourceMappingURL=ServiceObjectType.js.map