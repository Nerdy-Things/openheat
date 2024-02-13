const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express()

app.use(express.json()); // to support JSON-encoded bodies

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static('static'));

app.use(cookieParser());

app.set('trust proxy', true);

// <--------------- Auth immitation :)
app.post("/sign-in", function(req, res) {
    core.controller.auth.postAuth(req, res);
});

app.get("/logout", async function(req, res) {
    core.controller.auth.logOut(req, res);
});

app.all('*', function(req, res, next) {
    core.controller.auth.checkAuthAndProceed(req, res, next)
});
// ---------------> Auth immitation :) 

// <--------------- ESP32 CALLS
app.post("/api/temperature/update", async function(req, res) {
    core.controller.devices.saveTemperature(req, res);
});
// <--------------- ESP32 CALLS

// <--------------- WEBVIEWS
app.get("/", async function(req, res) {
    core.controller.charts.showGoogleCharts(req, res);
}); 

app.get("/charts/:days", async function(req, res) {
    core.controller.charts.showGoogleCharts(req, res);
});

app.get("/data", async function(req, res) {
    core.controller.raw.showRaw(req, res);
});

app.get("/devices", async function(req, res) {
    core.controller.devices.showDevices(req, res);
});

app.post("/devices", async function(req, res) {
    core.controller.devices.saveDevices(req, res);
});

app.get("/sensors", async function(req, res) {
    core.controller.devices.showSensors(req, res);
});

app.post("/sensors", async function(req, res) {
    core.controller.devices.saveSensors(req, res);
});

// ---------------> WEBVIEWS

//..............................................................................

// 404
app.use(async function(req, res, next) {
    res.status(404).send("There are no such page. Try again :)");
});

app.use((error, req, res, next) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
    }
    next();
});

// 500 - Any server error
app.use(async function(err, req, res, next) {
  var errorString = JSON.stringify(err, Object.getOwnPropertyNames(err));
  res.status(500).send(errorString);
});

process.on("unhandledRejection", async(reason, promise) => {
  console.log(reason);
  process.exit(1);
});

//..............................................................................
const port = 8080;
console.log("Listening", port);
http.createServer(app).listen(port);
