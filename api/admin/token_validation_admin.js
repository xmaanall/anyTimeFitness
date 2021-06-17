const jwt = require("jsonwebtoken");
module.exports = {
    checkToken: (req, res, next) => {
        let token = req.cookies.tokenAdmin;
        if (token) {
            jwt.verify(token, process.env.ACCESS_TOKEN_ADMIN_SECRET, (err, decoded) => {
                if (err) {
                    return res.json({
                        success: 0,
                        message: "Invalid Token..."
                    });
                } else {
                    req.decodedAdmin = decoded;
                    next();
                }
            });
        } else {
            res.render("401page")
        }
    }
};