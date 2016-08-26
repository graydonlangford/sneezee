var Sequelize = require('sequelize')
var env = process.env.NODE_ENV || 'development'
var sequelize

if (env === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
  })
} else {
  sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect':'sqlite',
    'storage': __dirname + '/data/dev-todo-api.sqlite'
  })
}

var db = {}

db.user = sequelize.import(__dirname + '/models/user.js')
db.iterator = sequelize.import(__dirname + '/models/iterator.js')
db.entry = sequelize.import(__dirname + '/models/entry.js')
db.token = sequelize.import(__dirname + '/models/token.js')
db.sequelize = sequelize
db.Sequelize = Sequelize

// assosciate iterators to user
db.user.hasMany(db.iterator)
db.iterator.belongsTo(db.user)

// assosciate entries to iterator
db.iterator.hasMany(db.entry)
db.entry.belongsTo(db.iterator)

module.exports = db
