# Use official Node.js runtime
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port (change 3000 if your app runs on another port)
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:dev"]
