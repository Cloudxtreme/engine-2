"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const SessionService_1 = require("../SessionService");
const HOST_REGEX = /tcp:\/\/(.+):(\d+)/;
exports.TelnetService = (config) => {
    return {
        name: 'portal.telnet',
        settings: config,
        methods: {
            listening() {
                this.logger.info(`listening on ${this.settings.host}`);
            },
            createSession(socket) {
                this.broker.createService(SessionService_1.SessionService(Object.assign({}, config, { socket: socket })));
            },
        },
        actions: {
            destroySession(context) {
                const service = this.broker.getLocalService(`portal.player.${context.params.uuid}`);
                this.broker.destroyService(service);
            },
        },
        created() {
            this.server = net.createServer();
            this.logger.debug('setting up tcp server');
            this.server.on('listening', this.listening);
            this.server.on('connection', this.createSession);
            const group = this.settings.host.match(HOST_REGEX);
            this.server.listen({ host: group[1], port: group[2] });
        },
    };
};
//# sourceMappingURL=TelnetService.js.map