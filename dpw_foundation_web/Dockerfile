# Use an official Node.js runtime as a parent image
FROM node:23-alpine

# Author information
LABEL maintainer="vykunta.yajjala@ics-global.in"

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Set environment variables to ignore ESLint and warnings
ENV CI=true
ENV NEXT_DISABLE_ESLINT=true

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build && npm install -g pm2

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the port the app runs on
EXPOSE 3000

# Use the entrypoint script to start the application
ENTRYPOINT ["/entrypoint.sh"]