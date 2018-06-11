"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ServiceObjectTrait(Base) {
    return class extends Base {
        constructor(traits) {
            super(traits);
            this.methods = {};
            this.actions = {};
            this.events = {};
            this.service = global.broker.createService(this._serviceDefinition());
            this.logger = this.service.logger;
        }
        created() { }
        started() { }
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
    };
}
exports.ServiceObjectTrait = ServiceObjectTrait;
//# sourceMappingURL=ServiceObjectTrait.js.map