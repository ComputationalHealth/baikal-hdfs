'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const getRouter = require('./routes');
const listEndpoints = require('express-list-endpoints')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

// View Engine
app.set('view engine', 'pug')

app.use(bodyParser.json());

const router = getRouter();
app.use('/', router);

app.get('/', (req, res) => {
  res.render('index', { title: 'HDFS Demo App', message: 'HDFS Node Example App' })
});

app.get('/show-routes',  (req, res) => {
  res.send(listEndpoints(app));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
