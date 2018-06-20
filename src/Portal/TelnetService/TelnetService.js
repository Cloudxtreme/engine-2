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
            /**
             * called when the net.server is actually listening for connections
             */
            listening() {
                this.logger.info(`listening on ${this.settings.host}`);
            },
            /**
             * called when a session is created by the net.server listener
             */
            createSession(socket) {
                this.broker.createService(SessionService_1.SessionService(Object.assign({}, config, { socket: socket })));
            },
        },
        actions: {
            /**
             * When a socket disconnects we need to delete the session, this is called by the SessionService instance
             * on socket close.
             */
            destroySession(context) {
                const service = this.broker.getLocalService(`portal.player.${context.params.uuid}`);
                this.broker.destroyService(service);
            },
        },
        created() {
            this.server = net.createServer();
            // setup the TCP listener
            this.logger.debug('setting up tcp server');
            this.server.on('listening', this.listening);
            this.server.on('connection', this.createSession);
            const group = this.settings.host.match(HOST_REGEX);
            this.server.listen({ host: group[1], port: group[2] });
        },
    };
};
