let path = require('path');
let express = require('express');
let app = express();
let router = express.Router();
let bodyParser = require('body-parser');
let routes = require('./router');
let mongoose = require('mongoose');
let config = require('../config/api');
global.__basedir = __dirname;

app.set('config', config);

require('./db-connection').connect(mongoose, config, app)

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api', routes(router));
app.use('/public',    express.static(path.join(__dirname, '../public')));
app.use('/static',    express.static(path.join(__dirname, '../dist/static')));
app.get('*',(req,res)=>{res.sendFile(path.join(__dirname, '../dist/index.html')); });

app.listen(3000, function () {
  console.log('App listening on port 3000');
})
