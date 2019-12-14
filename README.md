baikal-devenv
=============
This repository contains the Docker components necessary to deploy a local Hadoop and Node development environment. The curren configuration includes 2-node HDFS and a node app.


Instructions
------------

### Startup:

1. git clone https://github.com/ComputationalHealth/baikal-hdfs.git
2. docker-compose up -d --build
3. docker exec hadoop-namenode /bin/bash startup.sh
4. Access UI from http://localhost:9090

### Shutdown:
1. docker-compose down -v


