#!/bin/bash
#this script will be called by the cron every 5 minutes which
#will in turn call the actual poller to go get new contact lists
	
echo "This is callAmazonRebootManager.sh, and it is being called by the cron" >> /var/log/myLogFile

var=`uname -a | grep amzn1`

if [ -n "$var" ]; then
        `/sbin/shutdown -r now`
fi

