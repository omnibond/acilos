#!/bin/sh
#we sholdnt need to make a variable for /var/www/scoreboardTweets/php because we can
#make that the install Dir so it will always be on every system
CONFIGFILE='cron/socialConfig.txt'
for i in `cat $CONFIGFILE | grep '^[^#].*'`
do
   var=`echo "$i" | awk -F"=" '{print $1}'`
   param=`echo "$i" | awk -F"=" '{print $2}'`
   eval $var=$param
done

echo "Removing crons from the previous job"
crontab -r
#This will clear out everything from from the cron poller so that when cron calls it, nothing will happen
echo "Clearing Cron Manager"
cat > cron/callCronManager.sh << 'EOF'
echo "Run the start script to populate the CronManager"
EOF
echo "Done"

#This will clear out everything from from the client poller so that when cron calls it, nothing will happen
echo "Clearing Client Manager"
cat > cron/callClientManager.sh << 'EOF'
echo "Run the start script to populate the ClientManager"
EOF
echo "Done"

#This will clear out everything from from the heartbeat file
echo "Clearing Elasticsearch Heartbeat"
cat > cron/esHeartbeat.sh << 'EOF'
echo "Run the start script to populate the esHeartbeat"
EOF
echo "Done"

#This will clear out everything from from the heartbeat file
echo "Clearing AmazonRebootManager"
cat > cron/callAmazonRebootManager.sh << 'EOF'
echo "Run the start script to populate the callAmazonRebootManager"
EOF
echo "Done"

echo "Pausing for 5 minutes to give the pollers time to finish their last runs"
sleep 1 #60 seconds x 5 minutes = 300. 1 for testing purposes, aint nobody got time fo dat
echo "Done"

#STEP 1 GET THE MAPPING OBJECT 
#This line will save all mappings of a given index into a /tmp/mapping
echo "Getting the mapping of old instance"
touch /tmp/mapping
curl -XGET -o /tmp/mapping "http://$HOST:$PORT/$INDEX/_mapping?pretty=true" > /dev/null 2>&1
#The SED line removes the first two lines of tmp/mapping
sed -i '1,2d' /tmp/mapping
#hard codes the number of shards and the replicas
echo '{"settings":{"number_of_shards":1,"number_of_replicas":1},"mappings":{' >> /tmp/mappost
#appends the mappings list
cat /tmp/mapping >> /tmp/mappost

#STEP TWO TAR THE DATA FILES
today=`date +%s`;
#we want this name in a variable for later use as the time will change on us
indexName="$INDEX-$today";
#cd to the directory that contains the index
indexDir=$INDEXDIR
cd $indexDir
#tar up your index into a tarball appdended with todays date
echo "Saving snapshot of previous database instance"
tar czf /tmp/$indexName.tar.gz *
#create the restore script for later use
echo "Creating a restore script for the old instance"
cat <<EOF>> /tmp/$indexName-restore.sh
#!/bin/bash
#now we create the index and the mapping to be loaded into es when it restarts
#the mapping cannot exist in ES already, it must be added to a fresh DB
curl -XPUT "http://$HOST:$PORT/$indexName/" -d '`cat /tmp/mappost`' > /dev/null 2>&1
#now we untar the index in the proper place where the mapping is looking for it
cd $indexDir
tar xzf ../../../../../../ESBackups/$indexName.tar.gz .

#now we restart elasticsearch
/etc/init.d/elasticsearch restart
EOF
#move the tarball and the restore script to a safe backup dir
cd -
echo "Creating directories to shuffle around the files"
if [ ! -d "ESBackups/" ]; then
mkdir ESBackups
fi
mv /tmp/$indexName.tar.gz ESBackups
mv /tmp/$indexName-restore.sh ESBackups
#clean up tmp files and any other png files created in /images
#rm /var/www/SocialReader/cron/images/*
echo "Removing elasticsearch temp files"
rm /tmp/mapping
rm /tmp/mappost
echo "Done"