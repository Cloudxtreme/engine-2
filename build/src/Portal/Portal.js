"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const version_1 = require("../version");
const TelnetService_1 = require("./TelnetService");
exports.DEFAULT_CONFIG = {
    redis: 'redis://localhost:6379',
    host: 'tcp://localhost:2323',
    transporter: 'nats://localhost:4222',
};
exports.Portal = (options = {}) => {
    const config = Object.assign({}, exports.DEFAULT_CONFIG, options);
    console.log(`Starting Lucid Portal - v${version_1.VERSION}`);
    return {
        nodeID: 'lucid-portal',
        transporter: config.transporter,
        heartbeatInterval: 0.5,
        created(broker) {
            if (config.created) {
                config.created.bind(this)(broker);
            }
            broker.createService(TelnetService_1.TelnetService(config));
        },
        started(broker) {
            if (config.started) {
                config.started.bind(this)(broker);
            }
        },
        stopped(broker) {
            if (config.stopped) {
                config.stopped.bind(this)(broker);
            }
        },
        validation: true,
    };
};
//# sourceMappingURL=Portal.js.map