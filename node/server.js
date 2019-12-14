'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const getRouter = require('./routes');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.use(bodyParser.json());

const router = getRouter();
app.use('/', router);

app.get('/', (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
