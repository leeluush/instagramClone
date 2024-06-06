# Use the official Node.js 18 image as a base
FROM node:18 as builder

# Set the working directory in the container
WORKDIR /app

# Copy the entire client application
COPY client ./client

# Install client dependencies and build the client
RUN npm install --prefix client && npm run build --prefix client

# Copy backend package.json and package-lock.json and install dependencies
COPY backend/package*.json ./backend/
RUN npm install --prefix backend

# Now, set up the production image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy built client files from the 'builder' stage into the production image
COPY --from=builder /app/client/build ./client/build

# Copy backend files and install only production dependencies
COPY backend ./backend
COPY backend/package*.json ./backend/
RUN npm install --prefix backend --only=production

# Set the working directory to backend to start the server
WORKDIR /app/backend

# The command to run the server
CMD ["node", "server.js"]
