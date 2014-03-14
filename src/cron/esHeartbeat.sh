#!/bin/bash
#this script will be called by the cron every 3 minutes which 
#will make sure elasticsearch is running

#****************************************************************************
# Acilos app: https://github.com/omnibond/acilos
# Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
# All rights reserved.
# Omnibond Systems - www.omnibond.com for Acilos.com
#
# This file is the application's main JavaScript file. It is listed as a dependency in run.js and will automatically
# load when run.js loads.
#
# Because this file has the special filename `main.js`, and because we've registered the `app` package in run.js,
# whatever object this module returns can be loaded by other files simply by requiring `app` (instead of `app/main`).
#
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

