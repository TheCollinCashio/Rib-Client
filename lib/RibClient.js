"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io = require("socket.io-client");
let instance = null;
class RibClient {
    /**
        * Create an instance of RibClient
        * @param nameSpace
        * @param isSingleton
    **/
    constructor(urlNamespace, isSingleton = true) {
        this.functionMap = new Map();
        this.isConnected = false;
        let returnInstance = this;
        if (isSingleton && instance) {
            returnInstance = instance;
        }
        else {
            this.socket = urlNamespace ? io(urlNamespace) : io('/');
        }
        if (isSingleton && !instance) {
            instance = this;
        }
        return returnInstance;
    }
    /**
        * Called after rib client instance connects to rib server
        * @callback
    **/
    onConnect(cb) {
        this.socket.on('RibSendKeysToClient', (keys) => {
            this.setEmitFunctions(keys);
            if (!this.isConnected) {
                this.setUpOnFunctions();
                this.socket.emit('RibSendKeysToServer', [...this.functionMap.keys()]);
                this.isConnected = true;
                cb();
            }
        });
        this.socket.on('disconnect', () => {
            this.isConnected = false;
        });
    }
    /**
        * Expose a client side function that can be called with a rib server instance
        * @param fn
    **/
    exposeFunction(fn) {
        let fnName = fn.name;
        if (this.functionMap.get(fnName)) {
            throw new Error(`${fnName} already exists. The function names need to be unique`);
        }
        else {
            this.functionMap.set(fnName, fn);
        }
        if (this.isConnected) {
            this.setOnFunction(fn, fnName);
            this.socket.emit('RibSendKeysToServer', [fnName]);
        }
    }
    /**
        * Expose an array of client side functions that can be called with a rib server instance
        * @param fn
    **/
    exposeFunctions(fns) {
        for (let fn of fns) {
            this.exposeFunction(fn);
        }
    }
    /**
        * Conceal a client side function where it can no longer be accessed from the server
        * @param fn
    **/
    concealFunction(fn) {
        let fnName = fn.name;
        this.functionMap.delete(fnName);
        this.socket.off(fnName);
    }
    /**
        * Conceal client side functions where they can no longer be accessed from the server
        * @param fn
    **/
    concealFunctions(fns) {
        for (let fn of fns) {
            this.concealFunction(fn);
        }
    }
    setOnFunction(fn, fnName) {
        this.socket.on(fnName, (...args) => {
            fn(...args);
        });
    }
    setUpOnFunctions() {
        this.functionMap.forEach((fn, fnName) => {
            this.setOnFunction(fn, fnName);
        });
    }
    setEmitFunction(key) {
        this[key] = (...args) => {
            this.socket.emit(key, ...args);
        };
    }
    setEmitFunctions(keys) {
        for (let key of keys) {
            this.setEmitFunction(key);
        }
    }
}
exports.default = RibClient;
//# sourceMappingURL=RibClient.js.map