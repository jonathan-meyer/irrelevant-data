var db = require("../models");

// Lighthouse
// =============================================================
module.exports = function(app) {

  // Get all lighthouses
  app.get("/api/lighthouses", function(req, res) {
    db.Lighthouse.findAll({}).then(function(dbLighthouses) {
      res.json(dbLighthouses);
    });
  });

  // Get all lighthouses for the favoriteList's ID
  app.get("/api/lighthouses/:id", function(req, res) {
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
  app.post("/api/lighthouses", function(req, res) {
    db.Lighthouse.create(req.body).then(function(dbLighthouses) {
      res.json(dbLighthouses);
    });
  });

  // Delete a lightouse by id
  app.delete("/api/lighthouses/:id", function(req, res) {
    db.Lighthouse.destroy({ where: { id: req.params.id } }).then(function(dbLighthouses) {
      res.json(dbLighthouses);
    });
  });
};

// FavoriteList
// =============================================================
module.exports = function(app) {
  // Get all favoriteLists
  app.get("/api/favoriteLists", function(req, res) {
    db.FavoriteList.findAll({}).then(function(dbFavoriteLists) {
      res.json(dbFavoriteLists);
    });
  });

  // Get all favoriteLists for the user's ID
  app.get("/api/favoriteLists/:id", function(req, res) {
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
  app.post("/api/favoriteLists", function(req, res) {
    db.FavoriteList.create(req.body).then(function(dbFavoriteList) {
      res.json(dbFavoriteList);
    });
  });

  // Delete a FavoriteList by id
  app.delete("/api/favoriteLists/:id", function(req, res) {
    db.FavoriteList.destroy({ where: { id: req.params.id } }).then(function(dbFavoriteList) {
      res.json(dbFavoriteList);
    });
  });
};

// User
// =============================================================
module.exports = function(app) {
  // Get all users
  app.get("/api/users", function(req, res) {
    db.User.findAll({}).then(function(dbUsers) {
      res.json(dbUsers);
    });
  });

  // Create a new User
  app.post("/api/users", function(req, res) {
    db.User.create(req.body).then(function(dbUsers) {
      res.json(dbUsers);
    });
  });

  // Delete a User by id
  app.delete("/api/users/:id", function(req, res) {
    db.User.destroy({ where: { id: req.params.id } }).then(function(dbUsers) {
      res.json(dbUsers);

    });
  });

  // Add a user to the database
  app.post("/api/user/new", function(req, res){
      db.User.create(req.body).then(function(results){
          res.json(results);
      })
  })

  // Get users from database
  app.get("/api/users/:email", function(req, res){
      db.User.findAll({
          where: {
              email: req.params.email
          }
      }).then(function(results){
          res.json(results);
      })
  })
};
