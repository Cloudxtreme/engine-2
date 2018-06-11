"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("../");
class ServiceObjectType extends _1.ObjectType {
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