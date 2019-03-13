import * as io from 'socket.io-client'
let instance = null

export default class RibClient {
    private socket: SocketIOClient.Socket
    private functionMap = new Map<string, Function>()
    private isConnected = false

    constructor(urlNamespace?: string, isSingleton = true) {
        let returnInstance = this

        if (isSingleton && instance) {
            returnInstance = instance
        } else {
            this.socket = urlNamespace ? io(urlNamespace) : io('/')
        }

        if (isSingleton && !instance) {
            instance = this
        }
        
        return returnInstance
    }

    onConnect(cb: Function) {
        this.socket.on('RibSendKeysToClient', (keys: string[]) => {
            this.setEmitFunctions(keys)

            if (!this.isConnected) {
                this.setUpOnFunctions()
                this.socket.emit('RibSendKeysToServer', [...this.functionMap.keys()])
                this.isConnected = true
                cb()
            }
        })

        this.socket.on('disconnect', () => {
            this.isConnected = false
        })
    }

    exposeFunction(fn: Function) {
        let fnName = fn.name
        if (this.functionMap.get(fnName)) {
            throw new Error(`${fnName} already exists. The function names need to be unique`)
        } else {
            this.functionMap.set(fnName, fn)
        }

        if (this.isConnected) {
            this.setOnFunction(fn, fnName)
            this.socket.emit('RibSendKeysToServer', [fnName])
        }
    }

    exposeFunctions(funcs: Function[]) {
        for (let func of funcs) {
            this.exposeFunction(func)
        }
    }

    concealFunction(func: Function) {
        let funcName = func.name
        this.functionMap.delete(funcName)
        this.socket.off(funcName)
    }

    concealFunctions(funcs: Function[]) {
        for (let func of funcs) {
            this.concealFunction(func)
        }
    }

    private setOnFunction(fn: Function, fnName: string) {
        this.socket.on(fnName, (...args) => {
            fn(...args)
        })
    }

    private setUpOnFunctions() {
        this.functionMap.forEach((fn, fnName) => {
            this.setOnFunction(fn, fnName)
        })
    }

    private setEmitFunction(key: string) {
        this[key] = (...args) => {
            this.socket.emit(key, ...args)
        }
    }

    private setEmitFunctions(keys: string[]) {
        for (let key of keys) {
            this.setEmitFunction(key)
        }
    }
}