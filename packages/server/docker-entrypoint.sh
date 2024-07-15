#!/bin/sh

npm run migration:up
npm run build
npm run start:prod
