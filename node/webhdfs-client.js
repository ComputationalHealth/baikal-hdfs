// Include webhdfs module
var WebHDFS = require('webhdfs');

// Create a new
var hdfs = WebHDFS.createClient({
  user: 'hadoop', 
  host: 'hadoop-namenode', 
  port: 50070 // Namenode port
});

module.exports = hdfs;
