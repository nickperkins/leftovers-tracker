FROM node:22-bullseye

# Set working directory
WORKDIR /workspace

# Install global dependencies
RUN npm install -g typescript ts-node nodemon

# Configure npm to avoid permission issues without conflicting with nvm
RUN mkdir -p /home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
RUN npm config set cache /home/node/.npm-global/cache --global

# Install Git and other necessary tools
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install git sqlite3 curl

# Switch to non-root user
USER node