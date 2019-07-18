module.exports = function(sequelize, DataTypes) {
  var FavoriteList = sequelize.define("FavoriteList", {
    // Giving the FavoriteList model attributes
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  });

  FavoriteList.associate = function(models) {
    FavoriteList.belongsTo(models.User);
  };

  return FavoriteList;
};
