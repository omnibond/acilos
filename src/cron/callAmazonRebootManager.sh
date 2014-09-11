#!/bin/bash
#this script will be called every 10 minutes to check the available memory on the system... if it's below a certain #amount the script will reboot apache/httpd
#
#This setting is currently enabled and can be changed from the app settings tab under Manage the App -> Reboot Settings

logFile='/home/aaron/github/acilos/src/cron/instanceRebootLog.log'

timestamp=$(date +"%m-%d-%y %H:%M:%S")

echo ""$timestamp" Reboot script called by cron" >> "$logFile"

command=$(/sbin/shutdown -r now)

echo "$command" >> "$logFile"

