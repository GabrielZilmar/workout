#!/bin/sh

NODE_ENV=production npm run migration:up
NODE_ENV=production npm run build
NODE_ENV=production npm run start:prod
