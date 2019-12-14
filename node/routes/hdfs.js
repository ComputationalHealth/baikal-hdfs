const fs = require('fs');
const buffer = require('buffer');
const express = require('express');
const hdfs = require('../webhdfs-client');

function getHdfsRouter() {
  const router = express.Router();

  router.get('/put-file', putFile);
  router.get('/read-file', readFile);

  return router;
}

function putFile(req, res, next) {
  // Write a file to HDFS
  // Initialize readable stream from local file
  // Change this to real path in your file system
  var localFileStream = fs.createReadStream(__dirname + '/testfile2.txt');

  // Initialize writable stream to HDFS target
  var remoteFileStream = hdfs.createWriteStream('/data/testfile3.txt');

  // Pipe data to HDFS
  localFileStream.pipe(remoteFileStream);

  // Handle errors
  remoteFileStream.on('error', function onError(err) {
    // Do something with the error
    console.log('Error:n' + err);
    res.send('Error uploading file');
  });

  // Handle finish event
  remoteFileStream.on('finish', function onFinish() {
    // Upload is done
    console.log("File uploaded successfully");
    res.send('File uploaded successfully\n');
  });

}

function readFile(req, res, next) {
  let remoteFileStream = hdfs.createReadStream('/data/testfile.txt');

  remoteFileStream.on("error", function onError(err) { //handles error while read
    // Do something with the error
    res.send('Error Reading File: ' + err)
  });

  let dataStream = [];
  remoteFileStream.on("data", function onChunk(chunk) { //on read success
    // Do something with the data chunk 
    dataStream.push(chunk);
    console.log('..chunk..', chunk);
  });

  remoteFileStream.on("finish", function onFinish() { //on read finish
    console.log('..on finish..');
    console.log('..file data..', dataStream);
    res.send("File contents:\n" + dataStream.toString('ascii'));
  });



}

module.exports = { getHdfsRouter }
