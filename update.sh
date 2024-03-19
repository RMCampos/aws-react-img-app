#!/bin/bash

git pull
npm install
npm run build
rm -rf node_modules
serve --no-clipboard --single dist
