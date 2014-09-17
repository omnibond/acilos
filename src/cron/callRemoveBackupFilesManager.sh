#!/bin/bash
#this script will be called hourly to remove any json backup files from src or app-production
	

rm -f /home/aaron/github/acilos/src/*-backup.json
rm -f /home/aaron/github/acilos/src/serviceCredsBackup.json

