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

db.iterator = sequelize.import(__dirname + '/models/iterator.js')
db.entry = sequelize.import(__dirname + '/models/entries.js')
// db.user = sequelize.import(__dirname + '/models/user.js')
// db.token = sequelize.import(__dirname + '/models/token.js')
db.sequelize = sequelize
db.Sequelize = Sequelize

// db.todo.belongsTo(db.user)
// db.user.hasMany(db.todo)

db.entry.belongsTo(db.iterator)
db.iterator.hasMany(db.entry)

module.exports = db
