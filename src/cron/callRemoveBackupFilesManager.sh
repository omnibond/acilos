#!/bin/bash
#this script will be called hourly to remove any json backup files from src or app-production
	

rm -f /home/rgillet/gitHub/acilos/src/*-backup.json
rm -f /home/rgillet/gitHub/acilos/src/serviceCredsBackup.json

