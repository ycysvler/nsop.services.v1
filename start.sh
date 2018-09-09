#!/bin/bash
echo "Hello World !" 
pm2 start ./basedata/server.js --name='basedata-4997'
pm2 start ./model/server.js --name='model-4001'
pm2 start ./datasync/server.js --name='datasync-4998'
pm2 start ./hamaster/server.js --name='hamaster-4999'
