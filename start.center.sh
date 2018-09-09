#!/bin/bash
echo "Hello World !" 
pm2 start ./basedata/server.js --name='api:basedata:4997'
pm2 start ./model/server.js --name='api:model:4001'
pm2 start ./datasync/server.js --name='api:datasync:4998'
pm2 start ./hamaster/server.js --name='api:hamaster:4999'
pm2 start ./hamaster/services/dialing.js --name='service:dialing'
pm2 start ../nsop.web.v1/server/server.js --name='web:manager:4010'