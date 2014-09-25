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
	export ES_MIN_MEM="128m"
	export ES_MAX_MEM="128m"
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
	export ES_MIN_MEM="128m"
	export ES_MAX_MEM="128m"
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

EOF
echo ". " $MAINPATH"/cron/socialConfig.txt" >> cron/callCronManager.sh
cat >> cron/callCronManager.sh << 'EOF'
eval /usr/bin/wget -q -O /dev/null http://'$HOST'/cron/poller/cronManager.php?index='$INDEX'&mapping='$MAPPING'&host='$HOST'&port='$PORT'

EOF

echo "Writing The Client Manager"
cat > cron/callClientManager.sh << 'EOF'
#!/bin/bash
#this script will be called by the cron every 5 minutes which
#will in turn call the actual poller to go get new contact lists

EOF
echo ". " $MAINPATH"/cron/socialConfig.txt" >> cron/callClientManager.sh
cat >> cron/callClientManager.sh << 'EOF'
eval /usr/bin/wget -q -O /dev/null http://'$HOST'/cron/poller/clientManager.php?index='$INDEX'&mapping='$MAPPING'&host='$HOST'&port='$PORT'
	
EOF

echo "Writing The Amazon Reboot Manager"
cat > cron/callAmazonRebootManager.sh << 'EOF'
#!/bin/bash
#this script will be called by the cron every morning at 4:30 am to reboot the computer to free up resources
	
EOF

cat >> cron/callAmazonRebootManager.sh << 'EOF'

#This setting is currently disabled and can be changed from the app settings tab under Manage the App -> Reboot Settings

EOF

echo "Writing The Public Query Cron"
cat > cron/callPublicQueryManager.sh << 'EOF'
#!/bin/bash
#this script will be called by the cron every 10 minutes which
#will in turn call the actual poller to go get new contact lists
	
EOF

echo ". " $MAINPATH"/cron/socialConfig.txt" >> cron/callPublicQueryManager.sh
cat >> cron/callPublicQueryManager.sh << 'EOF'
eval /usr/bin/wget -q -O /dev/null http://'$HOST'/cron/poller/callPublicQueryManager.php?index='$INDEX'&mapping='$MAPPING'&host='$HOST'&port='$PORT'

EOF

echo "Writing The Httpd Reboot Manager"
cat > cron/callHttpdRebootManager.sh << 'EOF'
#!/bin/bash
#this script will be called every 10 minutes to check the available memory on the system... if it's below a certain #amount the script will reboot apache/httpd
	
EOF

cat >> cron/callHttpdRebootManager.sh << 'EOF'

#This setting is currently disabled and can be changed from the app settings tab under Manage the App -> Reboot Settings
	
EOF

echo "Writing The Clear Reboot Log Manager"
cat > cron/callClearRebootLogManager.sh << 'EOF'
#!/bin/bash
#this script will be called once per week to remove the instanceRebootLog and the apacheRebootLog
	
EOF

cat >> cron/callClearRebootLogManager.sh << EOF

rm -f $(pwd)/cron/instanceRebootLog.log
rm -f $(pwd)/cron/apacheRebootLog.log

EOF

echo "Writing Remove Backup Files Manager"
cat > cron/callRemoveBackupFilesManager.sh << 'EOF'
#!/bin/bash
#this script will be called hourly to remove any json backup files from src or app-production
	
EOF

cat >> cron/callRemoveBackupFilesManager.sh << EOF

rm -f $(pwd)/*-backup.json
rm -f $(pwd)/serviceCredsBackup.json

EOF

CRONGREP=`crontab -l | grep /cron/`
if [ "$CRONGREP" = "" ]; then
	echo "no socialreader crons were found... adding cronjobs"

	(crontab -l 2>/dev/null; echo "*/5 * * * * sh "$MAINPATH"/cron/callCronManager.sh") | crontab -
	(crontab -l 2>/dev/null; echo "*/10 * * * * sh "$MAINPATH"/cron/callPublicQueryManager.sh") | crontab -
	(crontab -l 2>/dev/null; echo "* */23 * * * sh "$MAINPATH"/cron/callClientManager.sh") | crontab -
	(crontab -l 2>/dev/null; echo "*/20 * * * * sh "$MAINPATH"/cron/poller/clearLogPoller.sh") | crontab -
	(crontab -l 2>/dev/null; echo "*/3 * * * * sh "$MAINPATH"/cron/esHeartbeat.sh") | crontab -
	#should run every day at 3:30am
	(crontab -l 2>/dev/null; echo "30 4 * * * sh "$MAINPATH"/cron/callAmazonRebootManager.sh") | crontab -
	(crontab -l 2>/dev/null; echo "*/10 * * * * sh "$MAINPATH"/cron/callHttpdRebootManager.sh") | crontab -
	(crontab -l 2>/dev/null; echo "0 6 * * 1 sh "$MAINPATH"/cron/callClearRebootLogManager.sh") | crontab -
	(crontab -l 2>/dev/null; echo "0 * * * * sh "$MAINPATH"/cron/callRemoveBackupFilesManager.sh") | crontab -
	
	echo "\nDone"
else 
	echo "Socialreader crons already running"
fi

echo "writing src/.htaccess file"

echo SetEnv SERVICECREDS $MAINPATH"/private/config/serviceCreds.json" > .htaccess
echo SetEnv PUBLICQUERYTERMOBJ $MAINPATH"/private/config/publicQueryTermObj.json" >> .htaccess
echo SetEnv LOCALQUERYTERMOBJ $MAINPATH"/private/config/localQueryTermObj.json" >> .htaccess
echo SetEnv APPSETTINGS $MAINPATH"/private/settings/appSettings.json" >> .htaccess
echo SetEnv BACKUPJSONPATH $MAINPATH"/private/config/" >> .htaccess
echo SetEnv SERVICECREDSBACKUP $MAINPATH"/private/config/serviceCredsBackup.json" >> .htaccess
echo SetEnv POSTLOG $MAINPATH"/private/config/postLog.json" >> .htaccess

echo "php_value session.cookie_lifetime 604800" >> .htaccess
echo "php_value session.gc_maxlifetime 604800" >> .htaccess
echo "php_value upload_max_filesize 100M" >> .htaccess
echo "php_value post_max_size 100M" >> .htaccess

echo "Priming database and clearing data"
#php startES.php

echo "Resetting reboot settings"
php resetRebootSettings.php

running=$(ps axho user,comm|grep -E "httpd|apache"|uniq|grep -v "root"|awk 'END {if ($1) print $1}')

echo "setting $running and 777 on all files"
cd ..
chown -R $running:$running *
chmod -R 777 *

#Restart apache so the changes to the .htaccess file will apply
if [ "$running" == "apache" ]; then
        service httpd restart
else
        service apache2 restart
fi

	
echo "Finshed, The app is ready to go"
