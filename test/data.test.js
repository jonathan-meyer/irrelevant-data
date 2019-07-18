require("dotenv").config();

const expect = require("chai").expect;
const db = require("../models");

describe("database", function() {
  it("add lighthouse and faviorate list", function() {
    Promise.all([
      db.User.findOrCreate({
        where: { provider: "test", token: "test-barny3" },
        defaults: {
          name: "Barny",
          provider: "test",
          token: "test-barny3"
        },
        include: [db.Lighthouse, db.FavoriteList]
      }),
      db.Lighthouse.findOrCreate({
        where: { name: "test" },
        defaults: {
          name: "test"
        },
        include: [db.User, db.FavoriteList]
      }),
      db.FavoriteList.findOrCreate({
        where: { name: "My List" },
        defaults: {
          name: "My List",
          owner: "Fred"
        },
        include: [db.User, db.Lighthouse]
      })
    ])
      .then(data => {
        const [[user], [lighthouse], [list]] = data;

        Promise.all([
          user.addLighthouse(lighthouse).then(() => {
            console.log("Lighthouse added to User");
          }),
          user.addFavoriteList(list).then(() => {
            console.log(">>> List added to User");
          }),
          list.addLighthouse(lighthouse).then(() => {
            console.log(">>> lighthouse added to my list");
          })
        ]).then(() => {
          list.reload().then(list => {
            console.log("list", list.get());
          });

          user.reload().then(user => {
            console.log("user", user.get());
          });

          lighthouse.reload().then(lighthouse => {
            console.log("lighthouse", lighthouse.get());
          });
        });
      })
      .catch(err => {
        console.log("error", err);
      });

    expect(true).to.be.true;
  });
});
