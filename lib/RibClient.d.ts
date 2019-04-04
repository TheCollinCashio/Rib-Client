/// <reference types="socket.io-client" />
export default class RibClient {
    _socket: SocketIOClient.Socket;
    private functionMap;
    private functionNamesMapKey;
    private isConnected;
    private hasConnected;
    private onConnectFunction;
    private disconnFunction;
    /**
        * Create an instance of RibClient
        * @param urlNameSpace
        * @param isSingleton
    **/
    constructor(urlNamespace?: string, isSingleton?: boolean);
    /**
        * Called after rib client instance connects to rib server
        * @callback
    **/
    onConnect(cb: Function): void;
    /**
        * Called after rib client instance disconnects from the rib server
        * @callback
    **/
    onDisconnect(cb: Function): void;
    /**
        * Expose a client side function that can be called from the rib server instance
        * @param fn
        * @param key
    **/
    exposeFunction(fn: Function, key?: string): void;
    /**
        * Expose an array of client side functions that can be called from the rib server instance
        * @param fns
        * @param key
    **/
    exposeFunctions(fns: Function[], key?: string): void;
    /**
        * Conceal a client side function where it can no longer be accessed from the server
        * @param fnName
    **/
    concealFunctionByName(fnName: string): void;
    /**
        * Conceal a client side function where it can no longer be accessed from the server
        * @param fnNames
    **/
    concealFunctionsByNames(fnNames: string[]): void;
    /**
        * Conceal a client side function where it can no longer be accessed from the server
        * @param fn
    **/
    concealFunction(fn: Function): void;
    /**
        * Conceal client side functions where they can no longer be accessed from the server
        * @param fns
    **/
    concealFunctions(fns: Function[]): void;
    /**
        * Conceal client side functions by key to which they were exposed where they can no longer be accessed from the server
        * @param key
    **/
    concealFunctionsByKey(key: string): void;
    private setUpDefaultOnFunctions;
    private setOnFunction;
    private setUpOnFunctions;
    private setEmitFunction;
    private setEmitFunctions;
}
