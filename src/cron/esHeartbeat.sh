#!/bin/bash
#this script will be called by the cron every 3 minutes which 
#will make sure elasticsearch is running

cd `dirname $0`
var=`date`

pgrep -f elasticsearch && running=1 || running=0
if [ $running = 1 ]; then
	echo "Elasticsearch is already running"
else
	echo "Starting elasticsearch"
	export ES_MIN_MEM="256m"
	export ES_MAX_MEM="256m"
	../elasticSearch/bin/elasticsearch
	echo "Done"
	
	if [ ! -e "esRestartLog.log" ]; then
cat > esRestartLog.log << 'FILE'
Elasticsearch Restart Log:
FILE
echo "Restarted on: " "$var" >> esRestartLog.log
	else
echo "Restarted on: " "$var" >> esRestartLog.log
	fi

fi

