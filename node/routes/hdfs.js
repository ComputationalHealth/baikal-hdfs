const fs = require('fs');
const buffer = require('buffer');
const express = require('express');
const hdfs = require('../webhdfs-client');

function getHdfsRouter() {
  const router = express.Router();

  router.get('/put-file', putFile);
  router.get('/read-file', readFile);
  router.get('/files', readFiles);

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
  let errorOccurred = null;

  if (req.query.path) {
    let remoteFileStream = hdfs.createReadStream(req.query.path);

    remoteFileStream.on("error", function onError(err) { //handles error while read
      // Do something with the error
      // res.send('Error Reading File:\n\n' + err)
      errorOccurred = err;
    });

    let dataStream = [];
    remoteFileStream.on("data", function onChunk(chunk) { //on read success
      // Do something with the data chunk 
      dataStream.push(chunk);
      console.log('..chunk..', chunk);
    });

    remoteFileStream.on("finish", function onFinish() { //on read finish
      console.log('..on finish..');
      if (errorOccurred) {
        res.status(500);
        res.send("Error occurred:<br/>" + errorOccurred);
      } else {
        console.log('..file data..', dataStream);
        res.send("File contents:\n" + dataStream.toString('ascii'));
      }

    });
  } else {
    throw new Error("'path' parameter is missing in querystring.\nPlease add ?path=/path/to/file to read file contents.");
  }
}

function readFiles(req, res, next) {
  if (req.query.path) {
    hdfs.readdir(req.query.path, function (err, files) {
      if (!err) {
        res.send(files);
      } else {
        res.status(500);
        res.send("Error occurred:<br/>" + err);
      }
    });
  } else {
    throw new Error("'path' parameter is missing in querystring.\nPlease add ?path=/path/to/file to display directory contents.");
  }
}

module.exports = { getHdfsRouter }
