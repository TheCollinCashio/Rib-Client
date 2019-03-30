import * as io from 'socket.io-client'
let instance = null

export default class RibClient {
    public _socket: SocketIOClient.Socket
    private functionMap = new Map<string, Function>()
    private isConnected = false
    private hasConnected = false
    private onConnectFunction: Function
    private disconnFunction: Function

    /**
        * Create an instance of RibClient
        * @param urlNameSpace
        * @param isSingleton
    **/
    constructor(urlNamespace?: string, isSingleton = true) {
        let returnInstance = this

        if (isSingleton && instance) {
            returnInstance = instance
        } else {
            this._socket = urlNamespace ? io(urlNamespace) : io('/')
            this.setUpDefaultOnFunctions()
        }

        if (isSingleton && !instance) {
            instance = this
        }

        return returnInstance
    }

    /**
        * Called after rib client instance connects to rib server
        * @callback
    **/
    onConnect(cb: Function) {
        this.onConnectFunction = cb
    }

    /**
        * Called after rib client instance disconnects from the rib server
        * @callback
    **/
    onDisconnect(cb: Function) {
        this.disconnFunction = cb
    }

    /**
        * Expose a client side function that can be called from the rib server instance
        * @param fn
    **/
    exposeFunction(fn: Function) {
        let fnName = fn.name
        if (this.functionMap.get(fnName)) {
            throw new Error(`${fnName} already exists. The function names need to be unique`)
        } else {
            this.functionMap.set(fnName, fn)
        }

        if (this.isConnected) {
            this.setOnFunction(fn, fnName)
            this._socket.emit('RibSendKeysToServer', [fnName])
        }
    }

    /**
        * Expose an array of client side functions that can be called from the rib server instance
        * @param fns
    **/
    exposeFunctions(fns: Function[]) {
        for (let fn of fns) {
            this.exposeFunction(fn)
        }
    }

    /**
        * Conceal a client side function where it can no longer be accessed from the server
        * @param fn
    **/
    concealFunction(fn: Function) {
        let fnName = fn.name
        this.functionMap.delete(fnName)
        this._socket.off(fnName)
    }

    /**
        * Conceal client side functions where they can no longer be accessed from the server
        * @param fns
    **/
    concealFunctions(fns: Function[]) {
        for (let fn of fns) {
            this.concealFunction(fn)
        }
    }

    private setUpDefaultOnFunctions() {
        this._socket.on('RibSendKeysToClient', (keys: string[]) => {
            this.setEmitFunctions(keys)

            if (!this.isConnected) {
                if (!this.hasConnected) {
                    this.setUpOnFunctions()
                    this.hasConnected = true
                }
                this._socket.emit('RibSendKeysToServer', [...this.functionMap.keys()])
                this.isConnected = true
                typeof this.onConnectFunction === 'function' && this.onConnectFunction()
            }
        })

        this._socket.on('disconnect', () => {
            this.disconnFunction && this.disconnFunction()
            this.isConnected = false
        })
    }

    private setOnFunction(fn: Function, fnName: string) {
        this._socket.on(fnName, (...args) => {
            fn(...args)
        })
    }

    private setUpOnFunctions() {
        this.functionMap.forEach((fn, fnName) => {
            this.setOnFunction(fn, fnName)
        })
    }

    private setEmitFunction(key: string) {
        if (!this[key]) {
            this[key] = (...args) => {
                return new Promise((resolve, reject) => {
                    try {
                        this._socket.emit(key, ...args, resolve)
                    } catch (ex) {
                        reject(ex)
                    }
                })
            }
        }
    }

    private setEmitFunctions(keys: string[]) {
        for (let key of keys) {
            this.setEmitFunction(key)
        }
    }
}