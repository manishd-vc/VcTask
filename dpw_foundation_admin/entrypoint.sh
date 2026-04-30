#!/bin/sh

# Run any necessary setup or environment variable loading here
echo "Starting Next.js application with PM2..."

# Start the Next.js application using PM2
pm2-runtime start npm --name "admin" -- run prod