#!/bin/bash
#this script will be called once per week to remove the instanceRebootLog and the apacheRebootLog
	

rm -f /home/aaron/github/acilos/src/cron/instanceRebootLog.log
rm -f /home/aaron/github/acilos/src/cron/apacheRebootLog.log

