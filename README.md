baikal-hdfs
=============
This repository contains the Docker components necessary to deploy a local Hadoop and Node development environment. The current configuration includes 2-node HDFS and a node app.

This example shows how to use Node.js with Express to connect to HDFS via WebHDFS. 

The example includes samples on how to:
 - Look up HDFS directory contents with a specified path (?path=/path/to/dir)
 - Upload a file with Express and Formidable into HDFS
 - View the contents of a file (as ascii with ?path=/path/to/file)


Instructions
------------

### Startup:

1. git clone https://github.com/ComputationalHealth/baikal-hdfs.git
2. docker-compose up -d --build
3. docker exec hadoop-namenode /bin/bash startup.sh
4. Access UI from http://localhost:9090

### Shutdown:
1. docker-compose down -v


