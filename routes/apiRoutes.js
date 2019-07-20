const express = require("express");
const acl = require("express-acl");

const db = require("../models");

const possessive = noun => {
  if (typeof noun !== "string") {
    throw new TypeError("Value passed must be a string");
  }

  if (noun.length === 0) {
    throw new Error("Cannot make empty string possessive");
  }

  if (noun.toLowerCase().endsWith("s")) {
    return noun + "'";
  }

  return noun + "'s";
};

acl.config({
  filename: "acl.json",
  baseUrl: "api",
  defaultRole: "guest",
  roleSearchPath: "user.role"
});

module.exports = function(app) {
  const router = express.Router();

  router.use(acl.authorize);

  // Lighthouse
  // =============================================================

  // Get all lighthouses
  router.get("/lighthouses", function(req, res) {
    db.Lighthouse.findAll({})
      .then(function(dbLighthouses) {
        res.json(dbLighthouses);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  // Get a lighthouse
  router.get("/lighthouses/:id", function(req, res) {
    db.Lighthouse.findOne({
      where: {
        id: req.params.id
      },
      include: [db.FavoriteList]
    })
      .then(function(dbLighthouses) {
        res.json(dbLighthouses);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  // Create a new lighthouse
  router.post("/lighthouses", function(req, res) {
    db.Lighthouse.create(req.body)
      .then(function(dbLighthouses) {
        res.json(dbLighthouses);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  // modify a lighthouse
  router.put("/lighthouses", function(req, res) {
    db.Lighthouse.update(req.body, { where: { id: req.body.id } })
      .then(function(dbLighthouses) {
        res.json(dbLighthouses);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  // Delete a lightouse by id
  router.delete("/lighthouses/:id", function(req, res) {
    db.Lighthouse.destroy({ where: { id: req.params.id } })
      .then(function(dbLighthouses) {
        res.json(dbLighthouses);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  // FavoriteList
  // =============================================================

  // Get a user's list
  router.get("/users/favorites", function(req, res) {
    db.FavoriteList.findAll({
      where: { UserId: req.user.id },
      include: [db.Lighthouse]
    })
      .then(function(data) {
        res.json(data);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  // modify a user's list
  router.put("/users/favorites", function(req, res) {
    const { user, body } = req;
    const { add, del } = body;

    console.log({ del, add });

    user
      .getFavoriteLists()
      .then(([list]) => {
        if (list === undefined) {
          return db.FavoriteList.create({
            name: `${possessive(user.name)} List`,
            description: "Auto generated list."
          }).then(list => user.addFavoriteLists(list).then(() => list));
        } else {
          return list;
        }
      })
      .then(list =>
        Promise.all([
          del && list.removeLighthouse(del),
          add && list.addLighthouse(add)
        ]).then(data => res.json({ removed: data[0], added: data[1] }))
      )
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  app.use("/api", router);
};
