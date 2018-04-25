"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SchemaBuilder_1 = require("../SchemaBuilder");
class ServiceSchema extends SchemaBuilder_1.SchemaBuilder {
    constructor(broker, config = {}) {
        super();
        this.settings = {};
        this.metadata = {};
        this.actions = {};
        this.events = {};
        this.methods = {};
        const { settings, metadata } = config;
        this.logger = broker.logger;
        this.broker = broker;
        this.settings = Object.assign({}, settings, this.settings);
        this.metadata = Object.assign({}, metadata, this.metadata);
    }
    schema() {
        return {
            actions: this.actions,
            settings: this.settings,
            name: this.name,
            events: this.events,
            methods: this.methods,
            metadata: this.metadata,
            created: this.created,
            started: this.started,
            stopped: this.stopped,
        };
    }
    created() {
        return;
    }
    started() {
        return new Promise((resolve) => resolve());
    }
    stopped() {
        return new Promise((resolve) => resolve());
    }
}
exports.ServiceSchema = ServiceSchema;
//# sourceMappingURL=ServiceSchema.js.map