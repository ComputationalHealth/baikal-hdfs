const express = require('express');
const hdfs = require('./hdfs');

function getRouter() {
  const router = express.Router();
  router.use('/hdfs', hdfs.getHdfsRouter());
  return router;
}

module.exports = getRouter
