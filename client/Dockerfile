# Command to configure the base image (official Node.js base image)
FROM node:alpine

# Set the working directory for the container
WORKDIR /app

# Command to copy the package files to working direcotory of the container
COPY package*.json ./

# Install dependencies inside the container
RUN npm install 

# Copy all the files from the existing directory to the docker container
COPY . .

# Specify the default command to run the application inside the container
CMD ["npm", "run", "dev"]