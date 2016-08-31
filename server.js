//===================================================\\
//=== DEPENDANCIES AND SETUP ========================\\
//===================================================\\

var express = require('express')
var bodyParser = require('body-parser')
var _ = require('underscore')
var db = require('./db.js')
var bcrypt = require('bcryptjs')
var middleware = require('./middleware.js')(db)

var app = express()
var PORT = process.env.PORT || 3000

var validParams = {
  user: ['email', 'password'],
  entry: ['timestamp', 'geostamp', 'metaValue'],
  iterator: ['singularName', 'pluralName', 'color'/*, 'createdAt', 'updatedAt'*/]//,
  // metas: [],
  // metaValues: []
}

app.use(bodyParser.json())

//===================================================\\
//=== MASTER ROUTE ==================================\\
//===================================================\\

app.get('/', function (req, res) {
  res.status(200).send('This is the API root. No endpoints exist here. Please use /users, /iterators, or /entries to proceed')
}) // MODIFY THIS TO REQUIRE LOGIN AND PROVIDE ALL DATA NEEDED TO INITIALIZE WEBAPP IN ONE CALL


//===================================================\\
//=== USER ROUTES ===================================\\
//===================================================\\

// CREATE user
app.post('/users', function (req, res) {
  var body = _.pick(req.body, validParams.user)

  db.user.create(body).then(function (user) {
    res.json(user.toPublicJSON())
  }, function (err) {
    res.status(400).json(err)
  })
})

// LOGIN
app.post('/users/login', function (req, res) {
  var body = _.pick(req.body, validParams.user) //remove fields that aren't needed
  var userInstance // create var for later storing logged in user

  db.user.authenticate(body).then(function (user) {
    var token = user.generateToken('authentication')
    userInstance = user

    return db.token.create({
      token: token
    })

  }).then(function (tokenInstance) {
    res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON)
  }).catch(function (err) {
    console.log(err)
    res.status(401).send()
  })
})

// LOGOUT
app.delete('/users/login', middleware.requireAuthentication, function (req, res) {
  req.token.destroy().then(function () {
    res.status(204).send()
  }).catch(function() {
    res.status(500).send()
  })
})

// DELETE user
// app.delete('/users', middleware.requireAuthentication, function (req, res) {
//   // delete a user's account, iterators, entries, and metas
// })


//===================================================\\
//=== ITERATOR ROUTES ===============================\\
//===================================================\\

// CREATE Iterator
app.post('/iterators', middleware.requireAuthentication, function (req, res) {
  var body = _.pick(req.body, validParams.iterator)

  db.iterator.create(body).then(function (iterator) {
    req.user.addIterator(iterator).then(function () {
      return iterator.reload()
    }).then(function (iterator) {
      res.json(iterator.toJSON())
    })
  }, function (err) {
    res.status(400).json(err)
  })
})

app.get('/iterators', middleware.requireAuthentication, function (req, res) {
  var query = _.pick(req.query, validParams.iterator)

  var where = {}

  //add ability to aproximate match on names and colors
  if (query.hasOwnProperty('singularName')) {where.singularName = query.singularName}
  if (query.hasOwnProperty('pluralName')) {where.pluralName = query.pluralName}
  if (query.hasOwnProperty('color')) {where.color = query.color}

  where.userId = req.user.get('id')
  
  db.iterator.findAll({where: where}).then(function (iterators) {
    iterators.forEach(function (iterator) {
      iterator = iterator.toJSON()
      delete iterator.userId
      console.log(iterator)
    })
    res.json(iterators)
  }, function (err) {
    res.status(500).send()
  })

})

app.get('/iterators/:iteratorId', middleware.requireAuthentication, function (req, res) {
  // get iterator by ID
})

// sub to socket.io stream

app.put('/iterators/:iteratorId', middleware.requireAuthentication, function (req, res) {
  // update an iterator
})

app.delete('/iterators/:iteratorId', middleware.requireAuthentication, function (req, res) {
  // delete an iterator
})

//===================================================\\
//=== META ROUTES ===================================\\
//===================================================\\

// meta routes


//===================================================\\
//=== ENTRY ROUTES ==================================\\
//===================================================\\

app.post('/iterators/:iteratorId/entries', middleware.requireAuthentication, function (req, res) {
  // log an entry
})

app.get('/iterators/:iteratorId/entries', middleware.requireAuthentication, function (req, res) {
  // get all entries for this iterator
  // query entries for this iterator
})

app.get('/iterators/:iteratorId/entries/:entryId', middleware.requireAuthentication, function (req, res) {
  // get a specific entry 
})

app.put('/iterators/:iteratorId/entries/:entryId', middleware.requireAuthentication, function (req, res) {
  // update a specific entry
})

app.delete('/iterators/:iteratorId/entries/:entryId', middleware.requireAuthentication, function (req, res) {
  // delete a specific entry
})


//===================================================\\
//=== START SERVER ==================================\\
//===================================================\\

// start sequelize and listen on port
db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT)
  })
})