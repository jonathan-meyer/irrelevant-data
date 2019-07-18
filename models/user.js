module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define(
    "User",
    {
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
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user"
      }
    },
    {
      indexes: [
        {
          name: "token_index",
          fields: ["provider", "token"]
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
