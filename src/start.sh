#!/bin/sh
#we sholdnt need to make a variable for /var/www/SocialReader because we can
#make that the install Dir so it will always be on every system
MAINPATH=`pwd`

CONFIGFILE='cron/socialConfig.txt'
for i in `cat $CONFIGFILE | grep '^[^#].*'`
do
   var=`echo "$i" | awk -F"=" '{print $1}'`
   param=`echo "$i" | awk -F"=" '{print $2}'`
   eval $var=$param
done

echo "Checking to make sure elasticSearch directory exists..."

if [ ! -d "elasticSearch/bin" ]; then
  echo "ElasticSearch must be installed before running this app"
  echo "Please download from the link - http://www.elasticsearch.org/download/ - and put the folder into /var/www/[ELASTICSEARCH-FOLDER]"
  exit
fi

#check to make sure that elasticsearch isnt already running else run it
[ $(pgrep -f elasticsearch) ] && running=1 || running=0
if [ $running = 1 ]; then
	echo "Elasticsearch is already running"
else
	echo "Starting elasticsearch"
#	export ES_MIN_MEM="128m"
#	export ES_MAX_MEM="128m"
	elasticSearch/bin/elasticsearch
	echo "Done"
fi

WGET_AUTH="--http-user=$HTTPUSER --http-password=$HTTPPASSWORD"

#echo "Clearing old database and starting fresh..."
#PROGRAM="wget http://$HOST/startES.php?index=$INDEX&host=$HOST&port=$PORT&mapping=$MAPPING --output-document=/dev/null"
#$PROGRAM
#echo "Done"

echo "Writing The Elasticsearch Heartbeat"
cat > cron/esHeartbeat.sh << 'EOF'
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
#	export ES_MIN_MEM="128m"
#	export ES_MAX_MEM="128m"
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

EOF

echo "Writing The Cron Manager"
cat > cron/callCronManager.sh << 'EOF'
#!/bin/bash
#this script will be called by the cron every 5 minutes which 
#will in turn call the actual poller to go get new information

cd $(pwd)
cd poller
php cronManager.php

EOF

echo "Writing The Client Manager"
cat > cron/callClientManager.sh << 'EOF'
#!/bin/bash
#this script will be called by the cron every 5 minutes which 
#will in turn call the actual poller to go get new contact lists

cd $(pwd)
cd poller
php clientManager.php

EOF

echo "Writing The Amazon Reboot Manager"
cat > cron/callAmazonRebootManager.sh << 'EOF'
#!/bin/bash
#this script will be called by the cron every 5 minutes which 
#will in turn call the actual poller to go get new contact lists

cd $(pwd)
cd poller
php amazonRebootManager.php

EOF

CRONGREP=`crontab -l | grep /cron/`
if [ "$CRONGREP" = "" ]; then
	echo "no socialreader crons were found... adding cronjobs"

	(crontab -l 2>/dev/null; echo "*/5 * * * * sh "$MAINPATH"/cron/callCronManager.sh") | crontab -
	(crontab -l 2>/dev/null; echo "* */23 * * * sh "$MAINPATH"/cron/callClientManager.sh") | crontab -
	(crontab -l 2>/dev/null; echo "*/20 * * * * sh "$MAINPATH"/cron/poller/clearLogPoller.sh") | crontab -
	(crontab -l 2>/dev/null; echo "*/3 * * * * sh "$MAINPATH"/cron/esHeartbeat.sh") | crontab -
	#should run every day at 3:30am
	(crontab -l 2>/dev/null; echo "30 03 * * * sh "$MAINPATH"/cron/callAmazonRebootManager.sh") | crontab -
	
	echo "\nDone"
else 
	echo "Socialreader crons already running"
fi

echo "Priming database and clearing data"
php startES.php

running=$(ps axho user,comm|grep -E "httpd|apache"|uniq|grep -v "root"|awk 'END {if ($1) print $1}')

echo "setting $running and 775 on all files"
cd ..
cd ..
chown -R $running:$running *
chmod -R 777 *
	
echo "Finshed, The app is ready to go"
