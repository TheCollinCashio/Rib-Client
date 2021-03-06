# Rib-Client [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/TheCollinCashio/Rib/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/rib-client.svg?style=flat)](https://www.npmjs.com/package/rib-client)
Rib-Client is a client library to access the Rib backend framework. This should be coupled with [rib-server](https://www.npmjs.com/package/rib-server) to create a simple real-time application. Rib-Client allows you to call server-side functions directly from the client.

For the official github, please click [here](https://github.com/TheCollinCashio/Rib).

## Example
```js
let RibClient = require("rib-client").default // or import using the CDN https://unpkg.com/rib-client@[VERSION#]/lib/cdn.js
let myRib = new RibClient()

myRib.onConnect(async () => {
    myRib.serverFunctions.logMessage("Runs the logMessage function server side 👨🏻‍💻")
    console.log(await myRib.add(1, 2))
})

function sendMSG(msg) {
    console.log(msg)
}

myRib.exposeFunctions([sendMSG])   //  allows us to call sendMSG from the server
```

## Documentation
**The default constructor takes two parameters:**
```
1) urlNamespace //  The server that you are connecting to
```
```
2) isSinglton   //  If true, the default value, each instentiation of RibClient will yeild the same object
```

**onConnect: Function**

Call a function after client connects to the server

**onDisconnect: Function**

Call a function when a client disconnects from the server

**exposeFunction: Function** 

Expose a client side function that can be called from the rib server instance

**exposeFunctions: Function** 

Expose an array of client side functions that can be called with a rib server instance

**concealFunction: Function** 

Conceal a client side function where it can no longer be accessed from the server

**concealFunctions: Function** 

Conceal client side functions where they can no longer be accessed from the server

**concealFunctionsByKey: Function**

Conceal client side functions by key to which they were exposed where they can no longer be accessed from the server

**close: Function**

Close the Rib client instance manually