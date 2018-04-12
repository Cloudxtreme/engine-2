"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SchemaBuilder_1 = require("../SchemaBuilder");
class ServiceSchema extends SchemaBuilder_1.SchemaBuilder {
    get actions() {
        return {};
    }
    get metadata() {
        return {};
    }
    get settings() {
        return {};
    }
    get methods() {
        return {};
    }
    constructor(broker, options = {}) {
        super();
        this.options = options;
        this.broker = broker;
        this.serviceActions = Object.assign({}, options.actions, this.actions);
        this.serviceMetadata = Object.assign({}, options.metadata, this.metadata);
        this.serviceSettings = Object.assign({}, options.settings, this.settings);
        this.serviceMethods = Object.assign({}, options.methods, this.methods);
    }
    created() {
        return;
    }
    schema() {
        return {
            name: this.name,
            actions: this.serviceActions,
            settings: this.serviceSettings,
            metadata: this.serviceMetadata,
            methods: this.serviceMethods,
            created: this.created,
        };
    }
}
exports.ServiceSchema = ServiceSchema;
//# sourceMappingURL=ServiceSchema.js.map