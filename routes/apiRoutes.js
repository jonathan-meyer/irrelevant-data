const express = require("express");
const acl = require("express-acl");

const db = require("../models");

acl.config({
  filename: "acl.json",
  baseUrl: "api",
  defaultRole: "guest",
  roleSearchPath: "user.provider"
});

module.exports = function(app) {
  const router = express.Router();

  router.use(acl.authorize);

  // Lighthouse
  // =============================================================

  // Get all lighthouses
  router.get("/lighthouses", function(req, res) {
    db.Lighthouse.findAll({}).then(function(dbLighthouses) {
      res.json(dbLighthouses);
    });
  });

  // Get all lighthouses for the favoriteList's ID
  router.get("/lighthouses/:id", function(req, res) {
    db.Lighthouse.findOne({
      where: {
        id: req.params.id
      },
      include: [db.FavoriteList]
    }).then(function(dbLighthouses) {
      res.json(dbLighthouses);
    });
  });

  // Create a new lighthouse
  router.post("/lighthouses", function(req, res) {
    db.Lighthouse.create(req.body).then(function(dbLighthouses) {
      res.json(dbLighthouses);
    });
  });

  // Delete a lightouse by id
  router.delete("/lighthouses/:id", function(req, res) {
    db.Lighthouse.destroy({ where: { id: req.params.id } }).then(function(
      dbLighthouses
    ) {
      res.json(dbLighthouses);
    });
  });

  // FavoriteList
  // =============================================================

  // Get all favoriteLists
  router.get("/favoriteLists", function(req, res) {
    db.FavoriteList.findAll({}).then(function(dbFavoriteLists) {
      res.json(dbFavoriteLists);
    });
  });

  // Get all favoriteLists for the user's ID
  router.get("/favoriteLists/:id", function(req, res) {
    db.FavoriteList.findOne({
      where: {
        id: req.params.id
      },
      include: [db.User]
    }).then(function(dbFavoriteList) {
      res.json(dbFavoriteList);
    });
  });

  // Create a new FavoriteList
  router.post("/favoriteLists", function(req, res) {
    db.FavoriteList.create(req.body).then(function(dbFavoriteList) {
      res.json(dbFavoriteList);
    });
  });

  // Delete a FavoriteList by id
  router.delete("/favoriteLists/:id", function(req, res) {
    db.FavoriteList.destroy({ where: { id: req.params.id } }).then(function(
      dbFavoriteList
    ) {
      res.json(dbFavoriteList);
    });
  });

  // User
  // =============================================================

  // Get all users
  router.get("/users", function(req, res) {
    db.User.findAll({}).then(function(dbUsers) {
      res.json(dbUsers);
    });
  });

  // Create a new User
  router.post("/users", function(req, res) {
    db.User.create(req.body).then(function(dbUsers) {
      res.json(dbUsers);
    });
  });

  // Delete a User by id
  router.delete("/users/:id", function(req, res) {
    res.status(401).json({ 401: "Unauthorized" });
  });

  // Add a user to the database
  router.post("/user/new", function(req, res) {
    db.User.create(req.body).then(function(results) {
      res.json(results);
    });
  });

  // Get users from database
  router.get("/users/:email", function(req, res) {
    db.User.findAll({
      where: {
        email: req.params.email
      }
    }).then(function(results) {
      res.json(results);
    });
  });

  app.use("/api", router);
};
