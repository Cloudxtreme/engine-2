const net = jest.genMockFromModule('net');

function createServer() {
    const server = new net.Server();
    server._events = {};
    server.on = function(event, cb) {
        this._events[event] = cb
    };
    server.listen = jest.fn();
    return server
}

net.createServer = createServer;

module.exports = net;
