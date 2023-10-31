# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Build your Vite app (you can change the command if necessary)
RUN npm run build

# Expose the port your app will run on (adjust as needed)
EXPOSE 8080

# Command to start your application
CMD ["npm", "run", "preview"]
