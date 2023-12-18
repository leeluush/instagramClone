# Use the official Node.js 18 image as a base
FROM node:18 as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for both client and backend
COPY client/package*.json ./client/
COPY backend/package*.json ./backend/

# Install client dependencies
RUN npm install --prefix client

# Build the client
RUN npm run build --prefix client

# Install backend dependencies
RUN npm install --prefix backend

# Now, set up the production image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy built client files from the 'builder' stage into the production image
COPY --from=builder /app/client/build ./client/build

# Copy backend files
COPY backend ./backend

# Copy the backend's package.json (and potentially other needed files)
COPY backend/package*.json ./backend/

# Install only production dependencies
RUN npm install --prefix backend --only=production

# Set the working directory to backend to start the server
WORKDIR /app/backend

# The command to run the server
CMD ["node", "server.js"]
