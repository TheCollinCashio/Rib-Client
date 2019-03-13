export default class RibClient {
    private socket;
    private functionMap;
    private isConnected;
    constructor(urlNamespace?: string, isSingleton?: boolean);
    onConnect(cb: Function): void;
    exposeFunction(fn: Function): void;
    exposeFunctions(funcs: Function[]): void;
    concealFunction(func: Function): void;
    concealFunctions(funcs: Function[]): void;
    private setOnFunction;
    private setUpOnFunctions;
    private setEmitFunction;
    private setEmitFunctions;
}
