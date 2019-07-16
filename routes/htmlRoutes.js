// Dependencies
const path = require("path");
const express = require("express");

const db = require("../models");

// Routes
module.exports = function(app) {
  // Load index page
  app.use("/", express.static(path.resolve("public")));
  app.use("/jquery", express.static(path.resolve("node_modules", "jquery")));
  app.use("/popper.js", express.static(path.resolve("node_modules", "popper.js")));
  app.use(
    "/bootstrap",
    express.static(path.resolve("node_modules", "bootstrap"))
  );

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.status(404).end();
  });
};