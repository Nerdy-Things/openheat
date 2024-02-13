const jwt = require('jsonwebtoken');
const token_name = "AuthCookie"

module.exports = {
    checkAuthAndProceed: async (req, res, next) => {
        // Api/temperature could be unauthorized
        if (req.originalUrl.startsWith("/api/temperature/")) {
            next();
        } else {
            const token = req.cookies[token_name]
            const systemInfo = await core.db.system.getConfig();
            try {
                const decoded = jwt.verify(token, systemInfo.device_uuid);
                if (decoded.admin) {
                    next();
                } else {
                    core.controller.auth.showAuth(req, res);
                }
              } catch(err) {
                core.controller.auth.showAuth(req, res);
              }
        }
    },

    logOut: async (req, res) => {
        res.clearCookie(token_name);
        res.redirect(302, "/");
    },

    showAuth: async (req, res) => {
        core.renderer.render(req, res, "/auth/auth.html", {});
    },

    postAuth: async (req, res) => {
        if (req.body.username == core.config.ADMIN_USER && req.body.password == core.config.ADMIN_PASSWORD) {
            const systemInfo = await core.db.system.getConfig();
            const token = jwt.sign({ admin: true }, systemInfo.device_uuid);
            res.cookie(token_name, token, { maxAge: 1704085200, httpOnly: true});
            console.log("Auth is done.");
        }
        res.redirect(302, "/");
    }
}