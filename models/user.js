module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // Giving the User model attributes
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  User.associate = function(models) {
    // Associating User with Lighthouses
    User.hasMany(models.Lighthouse, {});
    User.hasMany(models.FavoriteList, {});
  };

  return User;
};
