#!/bin/sh
#this script is called by saveRebootSettings in Database.php to populate the shell file called by the cron to reboot #httpd if the available memory gets too low

#echo "Writing The Httpd Reboot Manager"
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

running=$(ps axho user,comm|grep -E "httpd|apache"|uniq|grep -v "root"|awk 'END {if ($1) print $1}')

freeMem=$(free -m | awk '/^Mem/ {print $4}')

timestamp=$(date +"%m-%d-%y %H:%M:%S")

echo ""$timestamp" there are "$freeMem" megabytes of free memory" >> "$logFile"

if [ "$freeMem" -lt 200 ]; then
        if [ "$running" == "apache" ]; then
                echo ""$timestamp" rebooting apache" >> "$logFile"
                command=$(/sbin/service httpd restart)
                echo "$command" >> "$logFile"            
        else
                echo ""$timestamp" rebooting apache" >> "$logFile"
                command=$(/sbin/service apache2 restart)
                echo "$command" >> "$logFile"
        fi
else
        echo ""$timestamp" memory level still ok" >> "$logFile"
fi

EOF