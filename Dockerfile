# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory in the container to /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Make port 3020 available to the world outside this container
EXPOSE 3020

# Define environment variable NODE_ENV to production
ENV NODE_ENV production

# Run ts-node when the container launches
CMD ["npm", "start"]
