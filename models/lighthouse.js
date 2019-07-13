module.exports = function(sequelize, DataTypes) {
  var Lighthouse = sequelize.define("Lighthouse", {
    // Giving the Lighthouse model attributes
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    locationStreet: {
      type: DataTypes.STRING
    },
    locationCity: {
      type: DataTypes.STRING
    },
    locationState: {
      type: DataTypes.STRING
    },
    locationPostalCode: {
      type: DataTypes.INTEGER
    },
    locationLatitude: {
      type: DataTypes.DECIMAL
    },
    locationLongitude: {
      type: DataTypes.DECIMAL
    },
    height: {
      type: DataTypes.DECIMAL
    },
    yearBuilt: {
      type: DataTypes.INTEGER
    },
    inService: {
      type: DataTypes.BOOLEAN
    },
    serviceYearStart: {
      type: DataTypes.INTEGER
    },
    serviceYearEnd: {
      type: DataTypes.INTEGER
    }
  });

  Lighthouse.associate = function(models) {
    // Associating Lighthouse with favoriteLists
    Lighthouse.hasMany(models.FavoriteList, {});
  };

  return Lighthouse;
};
