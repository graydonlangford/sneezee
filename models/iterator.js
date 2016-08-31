var _ = require('underscore')

module.exports = function (sequelize, DataTypes) {
  var iterator = sequelize.define('iterator', {
    singularName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 250]
      }
    },
    pluralName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 250]
      }
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 250]
      }
    }
  })

  return iterator
}
