require('dotenv').config()

const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 4000;
const expresslayouts = require("express-ejs-layouts");
var flash = require('connect-flash');
const passport = require('passport');
const { getByMemberId } = require("./api/member/member.service")
// Import Routes
const memberRouter = require("./api/member/member.router");
const adminRouter = require("./api/admin/admin.router");
const classRouter = require("./api/class/class.router");

const membershipRouter = require("./api/membership/membership.router");

// Initialize express
const app = express();
app.use(cors())

//cookie token
app.use(cookieParser());

// Parses incoming requests based on body-parser
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
    limit: '50mb',
    extended: true
}));

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
// Look for static files here in this folder
app.use(express.static("public"));

// initilize flash msgs
let session = require('express-session');
app.use(session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 360000 }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Look into the views folder for layout.ejs file
app.use(expresslayouts);

// set another layout for admin pages
app.set('layout', 'layoutAdmin');


// Sharing vars to other pages
app.use(async function (req, res, next) {
    // cookie initlization
    const tokenMember = req.cookies.token;
    const tokenAdmin = req.cookies.tokenAdmin;

    // 1- Sharing member jwt payload to other pages
    if (tokenMember) {
        const payloadMember = jwt.verify(tokenMember, process.env.ACCESS_TOKEN_SECRET)
        const updatedResult = await getByMemberId(payloadMember.result._id)
        res.locals.currentMember = updatedResult;
    } else {
        res.locals.currentMember = null;
    }
    // 2- Sharing admin jwt payload to other pages
    if (tokenAdmin) {
        const payloadAdmin = jwt.verify(tokenAdmin, process.env.ACCESS_TOKEN_ADMIN_SECRET)
        res.locals.currentAdmin = payloadAdmin.result;
    } else {
        res.locals.currentAdmin = null;
    }
    // 3- Sharing flash msg to other pages
    res.locals.alerts = req.flash();

    next();
})


// Mount Routes
app.use('/member', memberRouter);
app.use('/class', classRouter);
app.use('/admin', adminRouter);
app.use('/membership', membershipRouter);


// render 404 page if url not found
app.get('*', function (req, res) {
    res.render("404page")
});

// Setting view engine to ejs.
// Node.js to look into the folder views for all ejs files
app.set("view engine", "ejs");

// mogoose connection
mongoose.connect(
    process.env.mongoDBURL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    () => {
        console.log(`Mongodb connected seccessfully!!! ${process.env.mongoDBURL}`);
    }
);

// Listen for HTTP request on PORT 4000
app.listen(PORT || 5000, () => {
    console.log(`Running on PORT  ${PORT}`);
});
