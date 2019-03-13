"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io = require("socket.io-client");
let instance = null;
class RibClient {
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
    exposeFunctions(funcs) {
        for (let func of funcs) {
            this.exposeFunction(func);
        }
    }
    concealFunction(func) {
        let funcName = func.name;
        this.functionMap.delete(funcName);
        this.socket.off(funcName);
    }
    concealFunctions(funcs) {
        for (let func of funcs) {
            this.concealFunction(func);
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