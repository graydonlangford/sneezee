//express modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const path = require('path');

//module variable declaration
const app = express();

//database connection
mongoose.connect('mongodb://localhost/sneezee');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
  //we're connected
});

//route imports
app.use(express.static('public'));
app.use(express.static('public/views'));

//routes
app.get('/',(req,res) => {
  res.sendFile('./public/views/index.html');
});

//start server on port 3000
app.listen(3000,() => {
  console.log('listening on 3000')
});
