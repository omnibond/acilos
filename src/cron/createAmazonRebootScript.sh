#!/bin/sh
#this script is called by saveRebootSettings in Database.php to populate the shell file called by the cron to reboot #the computer each morning at 3:30 am to free up resources

#echo "Writing the Amazon Reboot Manager"
cat > "$1" << 'EOF'
#!/bin/bash
#this script will be called every 10 minutes to check the available memory on the system... if it's below a certain #amount the script will reboot apache/httpd
#
#This setting is currently enabled and can be changed from the app settings tab under Reset App

EOF

cat >> "$1" << EOF
logFile='$2'
EOF

cat >> "$1" << 'EOF'

timestamp=$(date +"%m-%d-%y %H:%M:%S")

echo ""$timestamp" Reboot script called by cron" >> "$logFile"

command=$(/sbin/shutdown -r now)

echo "$command" >> "$logFile"

EOF