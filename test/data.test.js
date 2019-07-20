require("dotenv").config();

const db = require("../models");

describe("database", function() {
  beforeAll(done => {
    db.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  it("create a user", () => {
    return expect(
      db.User.findOrCreate({
        where: { provider: "test", token: "test-1234" },
        defaults: {
          name: "Fred Flintstone",
          provider: "test",
          token: "test-1234"
        },
        include: [db.Lighthouse, db.FavoriteList]
      })
    ).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Fred Flintstone",
          provider: "test",
          token: "test-1234"
        })
      ])
    );
  });

  it("create a lighthouse", () => {
    return expect(
      db.Lighthouse.findOrCreate({
        where: { name: "Fred's Cool Lighthouse" },
        defaults: {
          name: "Fred's Cool Lighthouse"
        },
        include: [db.User, db.FavoriteList]
      })
    ).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Fred's Cool Lighthouse"
        })
      ])
    );
  });

  it("create a list", () => {
    return expect(
      db.FavoriteList.findOrCreate({
        where: { name: "Fred's List" },
        defaults: {
          name: "Fred's List"
        },
        include: [db.User, db.Lighthouse]
      })
    ).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Fred's List"
        })
      ])
    );
  });
});
