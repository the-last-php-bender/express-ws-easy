import { WebSocketServer } from 'ws';
import http from 'http';

class Connection {
    constructor(app) {
        if (!app) {
            throw new Error("You must provide an Express app instance.");
        }

        this.app = app;
        this.server = http.createServer(app);
        this.wss = new WebSocketServer({ noServer: true });

        this.server.on('upgrade', (request, socket, head) => {
            this.wss.handleUpgrade(request, socket, head, (ws) => {
                this.wss.emit('connection', ws, request);
            });
        });
    }

    getWebSocketServer() {
        return this.wss;
    }

    start(port,callback) {
        this.server.listen(port,callback);
    }
}

export default Connection;
