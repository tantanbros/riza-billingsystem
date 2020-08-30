#!/bin/sh

sh ./vm-post-install.sh

docker-compose up -d --build

docker-compose ps 

sh ./nginx/setup.sh
