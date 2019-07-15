var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Lighthouse.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Lighthouse.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Lighthouse.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
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
