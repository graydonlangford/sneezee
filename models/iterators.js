module.exports = function (sequelize, DataTypes) {
  return sequelize.define('iterator', {
    singularName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        [1, 250]
      }
    },
    pluralName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        [1, 250]
      }
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        [1, 250]
      }
    }
  })
}
