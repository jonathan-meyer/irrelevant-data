module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define(
    "User",
    {
      // Giving the User model attributes
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      indexes: [
        {
          name: "token_index",
          fields: ["token"]
        }
      ]
    }
  );

  User.associate = function(models) {
    User.hasMany(models.Lighthouse);
    User.hasMany(models.FavoriteList);
  };

  return User;
};
