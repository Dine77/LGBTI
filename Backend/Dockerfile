# Use official Node.js image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all source files
COPY . .

# Expose backend port (5000 or whatever you use)
EXPOSE 5000

# Start the app
CMD ["node", "server.js"]
