const express = require("express");
//const ejs = require("ejs");
// const mongoose = require("mongoose");
const dotenv = require("dotenv");
const {body, validationResult} = require("express-validator");
const session = require("express-session");
const connectflash = require("connect-flash");
const app = express();
const jwt = require("jsonwebtoken");


dotenv.config({path: "./config.env"})

require("./db/mongo_connect");
const UserProfile = require("./db/schema/userprofileschema");
const Userdata = require("./db/schema/userdataschema");

// app.use(require("./routes/auth"));


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        //secure: true,
        httpOnly: true
    }
}))

app.use(connectflash())
app.use((req,res, next) => {
    res.locals.messages = req.flash();
    next();
})


app.get("/", function(req, res) {
    res.render("log-reg");
})

app.post("/", function(req, res) {
    const go = req.body.butt;
    if(go === "getlogin")
        res.redirect("login")
    if(go === "getregister")   
        res.redirect("register")
})

app.get("/register", function(req, res) {
    res.render("register");
})

app.post("/register", 
    [
        body("username").trim().notEmpty().withMessage("Username required..."),
        body("age").trim().notEmpty().withMessage("Age required..."),
        body("username").not().contains(" ").withMessage("Username must be without white spaces..."),
        body("password").trim().isLength(8).withMessage("Password must be of minimum 8 characters..."),
        body("age").trim().isNumeric().withMessage("Enter valid age...")
    ]
    ,function(req, res) {

        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            errors.array().forEach(err => {
                req.flash("err", err.msg);
            });
            res.render("register", {username: req.body.username, messages: req.flash()});
        }
        else {
            const name = req.body.username;
            const pass = req.body.password;
            const gen = req.body.gender;
            const age = req.body.age;

            UserProfile.findOne({username: name}, function(err, founduser) {
                if(founduser) {
                    req.flash("err", "Username already been taken...");
                    res.render("register", {username: req.body.username, messages: req.flash()});
                }
                else {
                    const newuser = new UserProfile({
                        username: name,
                        password: pass,
                        gender: gen,
                        age: age
                    });
                    newuser.save();

                    const newdata = new Userdata({
                        username: name,
                        userprofileid: newuser._id,
                        total: 0,
                        gamescore: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                    })
                    newdata.save();

                    res.redirect("user/" + newuser._id);
                }
            });          
        }
});

app.get("/login", function(req, res) {
    res.render("login");
})

app.post("/login",
    [
        body("username").trim().isLength(1).withMessage("Username required..."),
        body("password").trim().isLength(1).withMessage("Password required...")
    ],
    function(req, res) {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(err => {
            req.flash("err", err.msg);
        })
        res.render("login", {username: req.body.username, messages: req.flash()});
    }
    else {
        const id = req.body.username;
        const pass = req.body.password;
        UserProfile.findOne({username: id}, function(err, founduser) {
            if(founduser) {
                if(founduser.password === pass) {
                    res.redirect("user/" + founduser._id);
                } 
                else {
                    req.flash("err", "Wrong password...");
                    res.render("login", {username: req.body.username, messages: req.flash()});
                }                
            }
            else {
                req.flash("err", "Username not registered...");
                res.render("login", {username: req.body.username, messages: req.flash()});
            }
        });
    }
});

app.get("/user/:userroute", function(req, res) {
    
    const userid = req.params.userroute;
    Userdata.findOne({userprofileid: userid}, function(err, founduser) {        
        if(founduser) {
            //console.log(founduser);
            const userid = founduser.userprofileid;
            const name = founduser.username;
            const score = founduser.total;
            res.render("home", {userroute: userid, username: name, total: score});
        }
        else {    
            console.log("err");
            res.redirect("/");
        }
    })
})

app.get("/user/:userid/profile", function(req, res) {
    res.render("profile");
})

app.get("/user/:userid/update", function(req, res) {
    res.render("update");
})

app.listen("3000", function() {
    console.log("Server is running...");
})