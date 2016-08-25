module.exports = function (sequelize, DataTypes) {
  return sequelize.define('iterator', {
    timestamp: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        [1, 250]
      }
    },
    geostamp: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        [1, 250]
      }
    },
    metaValue: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        [1, 250]
      }
    }
  })
}
