let RibClient = require("../lib/RibClient").default
let PORT = process.argv[2] || 5000
let myRib = new RibClient(`http://localhost:${PORT}/`)

myRib.onConnect(async () => {
    myRib.logMessage("Runs the logMessage function server side 👨🏻‍💻")
    console.log(await myRib.add(1, 2))
    myRib.printObject(null)
})

myRib.onDisconnect(() => {
    console.log("We got disconnected from the Server 🙁")
})

function sendMSG(msg) {
    console.log(msg)
}

myRib.exposeFunctions([sendMSG])   //  allows us to call sendMSG from the server

console.log("Working on the things")