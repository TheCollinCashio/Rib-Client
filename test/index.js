let RibClient = require('../lib/RibClient').default
let PORT = process.argv[2] || 5000
let myRib = new RibClient(`http://localhost:${PORT}/`)

myRib.onConnect(() => {
    myRib.logMessage('Runs the logMessage function server side 👨🏻‍💻')
})

myRib.onDisconnect(() => {
    console.log('We got disconnected from the Server 🙁')
})

function sendMSG(msg) {
    console.log(msg)
}

myRib.exposeFunctions([sendMSG])   //  allows us to call sendMSG from the server