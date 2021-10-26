
const express = require("express");
const app = express.Router();

app.get("/", function(req, res) {
    console.log("through auth");
    res.render("log-reg");
})

module.exports = app;