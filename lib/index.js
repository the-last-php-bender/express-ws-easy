import Connection from './connection.js';
import Controller from './controller.js';

class WebSocketApp {
    constructor(app, port) {
        if (!app) {
            throw new Error("You must pass an instance of the Express app.");
        }

        this.port = port || 3000;
        this.connection = new Connection(app);  
        this.controller = new Controller(this.connection.getWebSocketServer());  
    }

    listen(callback){
        const type= typeof callback
        if(type !== 'function'){
            throw new Error(`function expected received ${type}`)
        }
        this.connection.start(this.port,callback);
    }

    getConnection() {
        return this.connection;
    }

    getController() {
        return this.controller;
    }
}

export {
    WebSocketApp
};
