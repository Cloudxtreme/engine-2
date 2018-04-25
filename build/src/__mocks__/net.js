"use strict";
const net = jest.genMockFromModule('net');
function createServer() {
    const server = new net.Server();
    server._events = {};
    server.on = function (event, cb) {
        this._events[event] = cb;
    };
    return server;
}
net.createServer = createServer;
module.exports = net;
//# sourceMappingURL=net.js.map