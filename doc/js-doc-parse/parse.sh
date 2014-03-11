#!/bin/bash

# Base directory for this entire project
BASEDIR=$(cd $(dirname $0) && pwd)

node $BASEDIR/parse.js $@
