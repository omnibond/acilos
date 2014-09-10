#!/bin/sh
#this script is called by saveRebootSettings in Database.php to populate the shell file called by the cron every 5 minutes to clear the memory cache

#echo "Writing The Clear Cache Manager"
cat > "$1" << 'EOF'
#!/bin/bash
#this script will be called every 5 minutes to empty the memory cache
#
#This setting is currently enabled and can be changed from the app settings tab under under Manage the App -> Reboot Settings

EOF

cat >> "$1" << EOF
logFile='$2'
EOF

cat >> "$1" << 'EOF'

timestamp=$(date +"%m-%d-%y %H:%M:%S")

echo ""$timestamp" Empty cache script called by cron" >> "$logFile"

command=$(sync && echo 3 | sudo tee /proc/sys/vm/drop_caches)

echo "$command" >> "$logFile"

EOF