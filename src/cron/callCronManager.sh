#!/bin/bash
#this script will be called by the cron every 5 minutes which 
#will in turn call the actual poller to go get new information

.  /home/aaron/repo/socialreader/src/cron/socialConfig.txt
eval /usr/bin/wget -q -O /dev/null http://'$HOST'/cron/poller/cronManager.php?index='$INDEX'&mapping='$MAPPING'&host='$HOST'&port='$PORT'

