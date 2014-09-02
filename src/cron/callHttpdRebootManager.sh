#!/bin/bash
#this script will be called every morning at 3:30 am to reboot httpd and free up
#some of the memory
	

running=$(ps axho user,comm|grep -E "httpd|apache"|uniq|grep -v "root"|awk 'END {if ($1) print $1}')

if [ "$running" == "apache" ]; then
        service httpd restart
else
        service apache2 restart
fi

