#!/bin/sh
docker stop statistics_mongo
docker volume remove statistics_volume
docker volume create statistics_volume
docker run -e MONGO_INITDB_ROOT_USERNAME=test -e MONGO_INITDB_ROOT_PASSWORD=test -p 27017:27017 --name statistics_mongo -v statistics_volume:/data/db -d --rm mongo:4.4.23
