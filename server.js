//===================================================\\
//=== DEPENDANCIES AND SETUP ========================\\
//===================================================\\

var express = require('express')
var bodyParser = require('body-parser')
var _ = require('underscore')
// var db = require('./db.js')
// var bcrypt = require('bcryptjs')
// var middleware = require('./middleware.js')(db)

var app = express()
var PORT = process.env.PORT || 3000

app.use(bodyParser.json())


//===================================================\\
//=== USER ROUTES ===================================\\
//===================================================\\

// user routes


//===================================================\\
//=== ITERATOR ROUTES ===============================\\
//===================================================\\

app.post('/iterators', function () {
  // create an iterator
})

app.get('/iterators', function () {
  // get all iterators for a user
  // query iterators
})

app.get('/iterators/:iteratorId', function () {
  // get iterator by ID
})

// sub to socket.io stream

app.put('/iterators/:iteratorId', function () {
  // update an iterator
})

app.delete('/iterators/:iteratorId', function () {
  // delete an iteraotr
})

//===================================================\\
//=== META ROUTES ===============================\\
//===================================================\\

// meta routes


//===================================================\\
//=== ENTRY ROUTES ==================================\\
//===================================================\\

app.post('/iterators/:iteratorId/entries', function () {
  // log an entry
})

app.get('/iterators/:iteratorId/entries', function () {
  // get all entries for this iterator
  // query entries for this iterator
})

app.get('/iterators/:iteratorId/entries/:entryId', function () {
  // get a specific entry 
}

app.put('/iterators/:iteratorId/entries/:entryId', function () {
  // update a specific entry
})

app.delete('/iterators/:iteratorId/entries/:entryId', function () {

})


