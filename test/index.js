let RibClient = require('../lib/RibClient').default
let PORT = process.argv[2] || 5000
let myRib = new RibClient(`http://localhost:${PORT}/`)

myRib.onConnect(async () => {
    myRib.logMessage('Runs the logMessage function server side 👨🏻‍💻', () => {}).then(() => {
        setTimeout(async () => {
            console.log('now lets add the things')
            console.log(await myRib.waitAndAdd(1, 2))
        })
    })
})

myRib.onDisconnect(() => {
    console.log('We got disconnected from the Server 🙁')
})

function sendMSG(msg) {
    console.log(msg)
}

myRib.exposeFunctions([sendMSG])   //  allows us to call sendMSG from the server