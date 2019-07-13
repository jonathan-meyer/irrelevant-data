module.exports = function(sequelize, DataTypes) {
  var FavoriteList = sequelize.define("FavoriteList", {
    // Giving the FavoriteList model attributes
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return FavoriteList;
};
