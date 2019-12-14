const fs = require('fs');
const { PassThrough } = require('stream');
const express = require('express');
const formidable = require('formidable');
const hdfs = require('../webhdfs-client');

function getHdfsRouter() {
  const router = express.Router();

  router.get('/upload-file', uploadFile);
  router.post('/upload-file', postFile);
  router.get('/read-file', readFile);
  router.get('/files', readFiles);
  return router;
}

function uploadFile(req, res, next) {
  res.render('hdfs/upload-file', { title: 'Upload File' });
}

// Write a file to HDFS 
// 1. Use formidable to get the file from the upload. 
// 2. Use a pass through stream to load the file data into as it's being uploaded
//    see the `part.on` section below.
// 3. Pipe the new file stream into hdfs 
function postFile(req, res, next) {
  const form = new formidable.IncomingForm();
  const pass = new PassThrough();

  const fileMeta = {};

  form.onPart = part => {
    if (!part.filename) {
      form.handlePart(part);
      return;
    }

    console.log("Part received ...");
    fileMeta.name = part.filename;
    fileMeta.type = part.mime;
    
    part.on('data', function (buffer) {
      pass.write(buffer);
    });

    part.on('end', function () {
      pass.end();
    });

  }

  form.parse(req, err => {
    if (err) {
      res.send('Error: ' + err);
    } else {
      handlePostStream(req, next, fileMeta, pass);
    }
  });

  const handlePostStream = async (req, next, fileMeta, fileStream) => {
    try {
      // Put the file into HDFS under the /data directory
      var remoteFileStream = hdfs.createWriteStream('/data/' + fileMeta.name);
      fileStream.pipe(remoteFileStream);

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
    } catch (error) {
      res.send("Error: " + error);
    }

  }
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
