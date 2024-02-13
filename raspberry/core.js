global.core = {};
global.core.config = {}
if(typeof process.env.PM2_STARTED === "undefined") {
    const config = require("./ecosystem.config.js").apps[0].env_production;
    for (const [key, value] of Object.entries(config)) {
        core.config[key] = value;
    }
} else {
    for (const [key, value] of Object.entries(process.env)) {
        console.log(key, value);
        core.config[key] = value;
    }
}

global.core.db = {}
global.core.db.executor = require("./db/executor.js")
global.core.db.temperature = require("./db/db_temperature.js")
global.core.db.device = require("./db/db_device.js")
global.core.db.action = require("./db/db_action.js")
global.core.db.system = require("./db/db_system.js")
global.core.db.relayLog = require("./db/db_relay_log.js")

global.core.util = {}
global.core.util.datetime = require("./util/util_datetime.js")

global.core.controller = {}
global.core.controller.raw = require("./controller/controller_raw.js")
global.core.controller.charts = require("./controller/controller_charts.js")
global.core.controller.devices = require("./controller/controller_device.js")
global.core.controller.auth = require("./controller/controller_auth.js")
global.core.controller.relay = {}
global.core.controller.relay.internal = require("./controller/controller_relay_internal.js")

global.core.renderer = require("./ui/renderer.js")
