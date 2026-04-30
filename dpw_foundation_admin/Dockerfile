# Use an official Node.js runtime as a parent image
FROM node:23-alpine

# Author information
LABEL maintainer="vykunta.yajjala@ics-global.in"

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies and sharp for Alpine
RUN apk add --no-cache --virtual .build-deps \
    build-base \
    python3 \
    && npm install --force \
    && npm install --os=linux --libc=musl --cpu=x64 sharp \
    && apk del .build-deps

# Copy the rest of the application code
COPY . .

RUN npm run build
RUN npm install -g pm2 --fetch-timeout=60000 --cache /tmp/npm-cache


# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the port the app runs on
EXPOSE 3003

# Use the entrypoint script to start the application
ENTRYPOINT ["/entrypoint.sh"]