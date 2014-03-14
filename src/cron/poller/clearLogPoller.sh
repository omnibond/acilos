#****************************************************************************
# Acilos app: https://github.com/omnibond/acilos
# Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
# All rights reserved.
# Omnibond Systems - www.omnibond.com for Acilos.com
#
# this poller clears log data out of apache in case it gets too large for amazon instances.
#
# $QT_BEGIN_LICENSE:LGPL$
#
# GNU Lesser General Public License Usage
# Alternatively, this file may be used under the terms of the GNU Lesser
# General Public License version 2.1 as published by the Free Software
# Foundation and appearing in the file LICENSE.LGPL included in the
# packaging of this file.  Please review the following information to
# ensure the GNU Lesser General Public License version 2.1 requirements
# will be met: http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html.
#
#
# If you have questions regarding the use of this file, please contact
# Omnibond Systems -  www.omnibond.com
#
# $QT_END_LICENSE$
#

running=$(ps axho user,comm|grep -E "httpd|apache"|uniq|grep -v "root"|awk 'END {if ($1) print $1}')

if [ "$running" = "www-data" ]; then
	rm -f /var/log/apache2/access.log.*
	rm -f /var/log/apache2/error.log.*
	echo "" > /var/log/apache2/error.log
	
	rm -f /var/www/socialreader/Branches/mobileFramework/src/logs/cron/log*
	rm -f /var/www/socialreader/Branches/mobileFramework/src/logs/misc/log*
	rm -f /var/www/socialreader/Branches/mobileFramework/src/logs/oAuth/log*
	
	rm -f /var/www/socialreader/Branches/mobileFramework/src/elasticSearch/logs/elasticsearch.log.*
fi

if [ "$running" = "apache" ]; then
	rm -f /var/log/httpd/access_log-*
	rm -f /var/log/httpd/error_log-*
	echo "" > /var/log/httpd/error_log
	
	rm -f /var/www/html/socialreader/Branches/mobileFramework/src/logs/cron/log*
	rm -f /var/www/html/socialreader/Branches/mobileFramework/src/logs/misc/log*
	rm -f /var/www/html/socialreader/Branches/mobileFramework/src/logs/oAuth/log*
	
	rm -f /var/www/html/socialreader/Branches/mobileFramework/src/elasticSearch/logs/elasticsearch.log.*
fi