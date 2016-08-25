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

var validParams = {
  entries: ['timestamp', 'geostamp', 'metaValue'],
  iterators: ['singularName', 'pluralName', 'color']//,
  // metas: [],
  // metaValues: []
}

var data = {
  iterators: [
    {
      id: 1,
      createdAt: 'timestamp',
      updatedAt: 'timestmap',
      userId: 1,
      singularName: 'iterator',
      pluralName: 'iterators',
      color: '#111111'
    }
  ],
  nextIteratorId: 2,
  entries: [
    {
      id: 1,
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
      iteratorId: 1,
      timestamp: 'timestamp',
      geoStamp: 'geostamp',
      metaValue: 'value'
    }
  ],
  nextEntryId: 2
}

app.get('/', function (req, res) {
  res.status(200).send('welcome to API root')
})

//===================================================\\
//=== USER ROUTES ===================================\\
//===================================================\\

// user routes


//===================================================\\
//=== ITERATOR ROUTES ===============================\\
//===================================================\\

// CREATE Iterator
app.post('/iterators', function (req, res) {
  //ensure required params are included??

  //remove unnessecary params
  var body = _.pick(req.body, validParams.iterators)

  //create iterator
  //db.iterators.create().then().then().etc
  var iteratorItem = {
    id: data.nextIteratorId,
    createdAt: new Date(),
    updatedAt: null,
    userId: 1,
    singularName: body.singularName,
    pluralName: body.pluralName,
    color: body.color
  }

  data.iterators.push(iteratorItem)
  data.nextIteratorId++

  res.json(iteratorItem)
})

app.get('/iterators', function (req, res) {
  // get all iterators for a user
  // query iterators

  res.json(data.iterators)
})

app.get('/iterators/:iteratorId', function (req, res) {
  // get iterator by ID
})

// sub to socket.io stream

app.put('/iterators/:iteratorId', function (req, res) {
  // update an iterator
})

app.delete('/iterators/:iteratorId', function (req, res) {
  // delete an iterator
})

//===================================================\\
//=== META ROUTES ===============================\\
//===================================================\\

// meta routes


//===================================================\\
//=== ENTRY ROUTES ==================================\\
//===================================================\\

app.post('/iterators/:iteratorId/entries', function (req, res) {
  // log an entry
})

app.get('/iterators/:iteratorId/entries', function (req, res) {
  // get all entries for this iterator
  // query entries for this iterator
})

app.get('/iterators/:iteratorId/entries/:entryId', function (req, res) {
  // get a specific entry 
})

app.put('/iterators/:iteratorId/entries/:entryId', function (req, res) {
  // update a specific entry
})

app.delete('/iterators/:iteratorId/entries/:entryId', function (req, res) {

})

app.listen(PORT, function () {
  console.log('Express listening on port ' + PORT)
})



