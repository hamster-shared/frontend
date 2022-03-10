#!/bin/bash

docker build -t hamstershare/hamstershare-frontend:latest .

docker push hamstershare/hamstershare-frontend:latest
