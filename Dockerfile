# Use Node.js 14 as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the code to the container
COPY . .

# Set the environment variable for the device access token
ENV DEVICE_ACCESS_TOKEN "j2imalpoe54esh19k2qz"

# Expose the port that the application will run on
EXPOSE 1883

# Start the application
CMD ["node", "mqtt-temperature.js"]