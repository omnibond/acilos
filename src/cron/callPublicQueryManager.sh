#!/bin/bash
#this script will be called by the cron every 10 minutes which
#will in turn call the actual poller to go get new contact lists
	
.  /home/rgillet/gitHub/acilos/src/cron/socialConfig.txt
eval /usr/bin/wget -q -O /dev/null http://'$HOST'/cron/poller/callPublicQueryManager.php?index='$INDEX'&mapping='$MAPPING'&host='$HOST'&port='$PORT'

