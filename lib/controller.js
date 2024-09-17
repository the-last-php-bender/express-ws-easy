import WebSocket from 'ws';

class Controller {
    constructor(wss) {
        this.wss = wss;
        this.clients = new Map();

        this.wss.on('connection', (ws) => {
            let userId;

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    userId = data.userId;

                    if (userId) {
                        this.registerClient(userId, ws);
                    }
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            });

            ws.on('close', () => {
                if (userId) {
                    this.unregisterClient(userId);
                }
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });
        });
    }

    registerClient(userId, ws) {
        this.clients.set(userId, ws);
    }

    unregisterClient(userId) {
        if (this.clients.has(userId)) {
            this.clients.delete(userId);
        } else {
            console.error(`Client with userId ${userId} not found.`);
        }
    }

    notifyDataBothClients(receiverId, senderId, data) {
        const receiverWs = this.clients.get(receiverId);
        const senderWs = this.clients.get(senderId);
        if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
            receiverWs.send(JSON.stringify(data));
            console.log(`Sent data to receiverId ${receiverId}:`, data);
        } else {
            console.error(`WebSocket for receiverId ${receiverId} not found or not open.`);
        }
        if (senderWs && senderWs.readyState === WebSocket.OPEN) {
            senderWs.send(JSON.stringify(data));
            console.log(`Sent data to senderId ${senderId}:`, data);
        } else {
            console.error(`WebSocket for senderId ${senderId} not found or not open.`);
        }
    }

    notifyDataToSpecificClient(userId, data) {
        const ws = this.clients.get(userId);
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
            console.log(`Sent data to userId ${userId}:, data`);
        } else {
            console.error(`WebSocket for userId ${userId} not found or not open.`);
        }
    }
    notifyDataToAllClients(data) {
        if (!this.wss) {
            console.error('WebSocket server not initialized.');
            return;
        }

        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
                console.log(`Sent data to all clients:`, data);
            }
        });
    }

    broadcastExcept(userId, data) {
        if (!this.wss) {
            console.error('WebSocket server not initialized.');
            return;
        }

        this.wss.clients.forEach((client) => {
            const clientUserId = [...this.clients.entries()].find(([id, ws]) => ws === client)?.[0];
            if (client.readyState === WebSocket.OPEN && clientUserId !== userId) {
                client.send(JSON.stringify(data));
            }
        });
    }

    getAllConnectedClients() {
        return [...this.clients.keys()];
    }

    pingAllClients() {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.ping();
                console.log('Ping sent to a client');
            }
        });
    }
}

export default Controller;
