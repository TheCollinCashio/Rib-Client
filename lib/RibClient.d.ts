export default class RibClient {
    private socket;
    private functionMap;
    private isConnected;
    /**
        * Create an instance of RibClient
        * @param nameSpace
        * @param isSingleton
    **/
    constructor(urlNamespace?: string, isSingleton?: boolean);
    /**
        * Called after rib client instance connects to rib server
        * @callback
    **/
    onConnect(cb: Function): void;
    /**
        * Expose a client side function that can be called with a rib server instance
        * @param fn
    **/
    exposeFunction(fn: Function): void;
    /**
        * Expose an array of client side functions that can be called with a rib server instance
        * @param fn
    **/
    exposeFunctions(fns: Function[]): void;
    /**
        * Conceal a client side function where it can no longer be accessed from the server
        * @param fn
    **/
    concealFunction(fn: Function): void;
    /**
        * Conceal client side functions where they can no longer be accessed from the server
        * @param fn
    **/
    concealFunctions(fns: Function[]): void;
    private setOnFunction;
    private setUpOnFunctions;
    private setEmitFunction;
    private setEmitFunctions;
}
