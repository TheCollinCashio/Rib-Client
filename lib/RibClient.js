"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io = require("socket.io-client");
let instance = null;
class RibClient {
    /**
        * Create an instance of RibClient
        * @param urlNameSpace
        * @param isSingleton
    **/
    constructor(urlNamespace, isSingleton = true) {
        this.functionMap = new Map();
        this.isConnected = false;
        this.hasConnected = false;
        let returnInstance = this;
        if (isSingleton && instance) {
            returnInstance = instance;
        }
        else {
            this._socket = urlNamespace ? io(urlNamespace) : io('/');
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
        this._socket.on('RibSendKeysToClient', (keys) => {
            this.setEmitFunctions(keys);
            if (!this.isConnected) {
                if (!this.hasConnected) {
                    this.setUpOnFunctions();
                    this.hasConnected = true;
                }
                this._socket.emit('RibSendKeysToServer', [...this.functionMap.keys()]);
                this.isConnected = true;
                cb();
            }
        });
        this._socket.on('disconnect', () => {
            this.disconnFunction && this.disconnFunction();
            this.isConnected = false;
        });
    }
    /**
        * Called after rib client instance disconnects from the rib server
        * @callback
    **/
    onDisconnect(cb) {
        this.disconnFunction = cb;
    }
    /**
        * Expose a client side function that can be called from the rib server instance
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
            this._socket.emit('RibSendKeysToServer', [fnName]);
        }
    }
    /**
        * Expose an array of client side functions that can be called from the rib server instance
        * @param fns
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
        this._socket.off(fnName);
    }
    /**
        * Conceal client side functions where they can no longer be accessed from the server
        * @param fns
    **/
    concealFunctions(fns) {
        for (let fn of fns) {
            this.concealFunction(fn);
        }
    }
    setOnFunction(fn, fnName) {
        this._socket.on(fnName, (...args) => {
            fn(...args);
        });
    }
    setUpOnFunctions() {
        this.functionMap.forEach((fn, fnName) => {
            this.setOnFunction(fn, fnName);
        });
    }
    setEmitFunction(key) {
        if (!this[key]) {
            this[key] = (...args) => {
                return new Promise((resolve, reject) => {
                    try {
                        this._socket.emit(key, ...args, resolve);
                    }
                    catch (ex) {
                        reject(ex);
                    }
                });
            };
        }
    }
    setEmitFunctions(keys) {
        for (let key of keys) {
            this.setEmitFunction(key);
        }
    }
}
exports.default = RibClient;
//# sourceMappingURL=RibClient.js.map