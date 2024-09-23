# Use the official Node.js image from Docker Hub
# Choose the Node version based on your app's requirements
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install --production
# If you are building for development, you can use the command below instead:
# RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on (default for Node.js apps is 8080 or 3000)
EXPOSE 3000

# Start the app
CMD [ "npm", "start" ]
