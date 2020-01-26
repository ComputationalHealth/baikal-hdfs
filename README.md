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

### Prerequisite for Docker on Windows
Due to an update in Hyper-V, some ports are now reserved and cannot be bound within a container. The following will need to be run, which will require system restarts.

At an elevated command prompt (see commands in code block below):

1. Disable Hyper-V, restart
```
dism.exe /Online /Disable-Feature:Microsoft-Hyper-V
```

2. Reserve ports, enable Hyper-V, restart (note, may take a few minutes for services to fully disable and allow ports to be excluded).
 - To view excluded ports: ```netsh int ipv4 show excludedportrange protocol=tcp```
```
dism.exe /Online /Disable-Feature:Microsoft-Hyper-V
netsh int ipv4 add excludedportrange protocol=tcp startport=50070 numberofports=1
netsh int ipv4 add excludedportrange protocol=tcp startport=50090 numberofports=1
dism.exe /Online /Enable-Feature:Microsoft-Hyper-V /All
```

### Startup:

1. git clone https://github.com/ComputationalHealth/baikal-hdfs.git
2. docker-compose up -d --build
3. docker exec hadoop-namenode /bin/bash startup.sh
4. Access UI from http://localhost:9090

### Shutdown:
1. docker-compose down -v


