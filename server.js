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

// prepareAttributes = function (object, attributes) {
//   var output = {}
//   attributes.forEach(function (attribute) {
//     if (object.hasOwnProperty(attribute)) {output[attribute] = object[attribute]}
//   })

//   // if attributes is empty, then return a 400 or something
//   return output
// }

//===================================================\\
//=== MASTER ROUTE ==================================\\
//===================================================\\

app.get('/', function (req, res) {
  res.status(200).send('This is the API root. No endpoints exist here. Please use /users or /users/login to proceed')
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
      iterator = iterator.toJSON()
      delete iterator.userId
      res.json(iterator)
    })
  }, function (err) {
    res.status(400).json(err)
  })
})


app.get('/iterators', middleware.requireAuthentication, function (req, res) {
  var query = _.pick(req.query, validParams.iterator)

  //add ability to aproximate match on names and colors
  // if (query.hasOwnProperty('singularName')) {where.singularName = query.singularName}
  // if (query.hasOwnProperty('pluralName')) {where.pluralName = query.pluralName}
  // if (query.hasOwnProperty('color')) {where.color = query.color}

  query.userId = req.user.get('id')
  
  db.iterator.findAll({where: query}).then(function (iterators) {
    iterators.forEach(function (iterator) {
      iterator = iterator.toJSON()
      delete iterator.userId
    })
    res.json(iterators)
  }, function (err) {
    res.status(500).send()
  })

})


app.get('/iterators/:iteratorId', middleware.requireAuthentication, function (req, res) {
  var iteratorId = parseInt(req.params.iteratorId, 10)

  db.iterator.findOne({
    where: {
      userId: req.user.get('id'),
      id: iteratorId
    }
  }).then(function (iterator) {
    if (iterator) {
      res.json(iterator.toJSON())
    } else {
      res.status(404).send()
    }
  }, function (err) {
    res.status(500).send()
  })
})


// sub to socket.io stream
//app.get('/users/stream' or '/iterators/:id/stream')


app.put('/iterators/:iteratorId', middleware.requireAuthentication, function (req, res) {
  var iteratorId = parseInt(req.params.iteratorId, 10)
  var body = _.pick(req.body, validParams.iterator)

  db.iterator.findOne({
    where: {
      userId: req.user.get('id'),
      id: iteratorId
    }
  }).then(function (iterator) {
    if (iterator) {
      iterator.update(body).then(function (iterator) {
        // res.json(iterator.toJSON())
        iterator = iterator.toJSON()
        delete iterator.userId
        res.json(iterator)
      }, function (err) {
        res.status(400).json(err)
      })
    } else {
      res.status(404).json(err)
    }
  }, function (err) {
    res.status(500).send()
  })

})


// NEEDS TO DELETE ALL ENTRIES ALSO
app.delete('/iterators/:iteratorId', middleware.requireAuthentication, function (req, res) {
  var iteratorId = parseInt(req.params.iteratorId, 10)

  db.iterator.findOne({
    where: {
      userId: req.user.get('id'),
      id: iteratorId
    }
  }).then(function (iterator) {
    if (iterator) {
      db.entry.destroy({
        where: {
          iteratorId: iteratorId
        }
      }).then(function () {
        iterator.destroy().then(function () {
          res.status(204).send()
        }, function (err) {})
      }, function (err) {
        res.status(500).send()
      })
    } else {
      res.status(400).send()
    }
  }, function (err) {
    res.status(500).send()
  })
})

//===================================================\\
//=== META ROUTES ===================================\\
//===================================================\\

// meta routes


//===================================================\\
//=== ENTRY ROUTES ==================================\\
//===================================================\\

// MOST ENTRY ROUTES SHOULD START LIKE THIS
// var iteratorId = parseInt(req.params.iteratorId, 10)
// var entryId = parseInt(req.params.entryId, 10)
// var body = _.pick(req.body, validParams.entry)
// var query = _.pick(req.query, validParams.entry)

// db.iterator.findOne({
//   where: {
//     userId: req.user.get('id'),
//     id: iteratorId
//   }
// }).then(function (iterator) {
//   if (iterator) {
//     // there was an iterator. Operate on entry as normal
//   } else {
//     res.status(400).send()
//   }
// }, function (err) {
//   res.status(500).send()
// })

app.post('/iterators/:iteratorId/entries', middleware.requireAuthentication, function (req, res) {
  var iteratorId = parseInt(req.params.iteratorId, 10)
  var entryId = parseInt(req.params.entryId, 10)
  var body = _.pick(req.body, validParams.entry)

  db.iterator.findOne({
    where: {
      userId: req.user.get('id'),
      id: iteratorId
    }
  }).then(function (iterator) {
    if (iterator) {
      db.entry.create(body).then(function (entry) {
        iterator.addEntry(entry).then(function () {
          return entry.reload()
        }).then(function (entry) {
          res.json(entry.toJSON())
        })
      }, function (err) {
        res.status(400).json(err)
      }).catch(function (err) {
        console.log(err)
      })

    } else {
      res.status(400).send()
    }
  }, function (err) {
    res.status(500).send()
  })

})

app.get('/iterators/:iteratorId/entries', middleware.requireAuthentication, function (req, res) {
  var iteratorId = parseInt(req.params.iteratorId, 10)
  var entryId = parseInt(req.params.entryId, 10)
  var query = _.pick(req.query, validParams.entry)

  db.iterator.findOne({
    where: {
      userId: req.user.get('id'),
      id: iteratorId
    }
  }).then(function (iterator) {
    if (iterator) {
      query.iteratorId = iteratorId
      db.entry.findAll({where: query}).then(function (entries) {
        entries.forEach(function (entry) {
          entry = entry.toJSON()
        })
        res.json(entries)
      })
    } else {
      // there is no iterator
      res.status(400).send()
    }
  }, function (err) {
    res.status(500).send()
  })

})

app.get('/iterators/:iteratorId/entries/:entryId', middleware.requireAuthentication, function (req, res) {
  var entryId = parseInt(req.params.entryId, 10)
  var iteratorId = parseInt(req.params.iteratorId, 10)

  db.iterator.findOne({
    where: {
      userId: req.user.get('id'),
      id: iteratorId
    }
  }).then(function (iterator) {
    if (iterator) {
      // there was an iterator. Operate on entry as normal
      db.entry.findOne({
        where: {
          iteratorId: iteratorId,
          id: entryId
        }
      }).then(function (entry) {
        if (entry) {
          res.json(entry.toJSON())
        } else {
          res.status(404).send()
        }
      })
    } else {
      res.status(400).send()
    }
  }, function (err) {
    res.status(500).send()
  })
})


app.put('/iterators/:iteratorId/entries/:entryId', middleware.requireAuthentication, function (req, res) {
  var iteratorId = parseInt(req.params.iteratorId, 10)
  var entryId = parseInt(req.params.entryId, 10)
  var body = _.pick(req.body, validParams.entry)

  db.iterator.findOne({
    where: {
      userId: req.user.get('id'),
      id: iteratorId
    }
  }).then(function (iterator) {
    if (iterator) {
      // there was an iterator. Operate on entry as normal
      db.entry.findOne({
        where: {
          id: entryId,
          iteratorId: iteratorId
        }
      }).then(function (entry) {
        if (entry) {
          entry.update(body).then(function (entry) {
            res.json(entry.toJSON())
          }, function (err) {
            res.status(500).send()
          })
        } else {
          res.status(404).send()
        }
      }, function (err) {
        res.status(500).send()
      })
    } else {
      res.status(400).send()
    }
  }, function (err) {
    res.status(500).send()
  })
})


app.delete('/iterators/:iteratorId/entries/:entryId', middleware.requireAuthentication, function (req, res) {
  var iteratorId = parseInt(req.params.iteratorId, 10)
  var entryId = parseInt(req.params.entryId, 10)

  db.iterator.findOne({
    where: {
      userId: req.user.get('id'),
      id: iteratorId
    }
  }).then(function (iterator) {
    if (iterator) {
      db.entry.findOne({
        where:{
          id: entryId, 
          iteratorId: iteratorId
        }
      }).then(function (entry) {
        if (entry) {
          entry.destroy().then(function () {
            res.status(204).send()
          }).catch(function () {
            res.status(500).send()
          })
        } else {
          res.status(404).send()
        }
      })
    } else {
      res.status(400).send()
    }
  }, function (err) {
    res.status(500).send()
  })

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