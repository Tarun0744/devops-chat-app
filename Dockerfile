# STAGE 1: Build stage
# Use a Node image with build tools
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
# This step is cached if dependencies haven't changed, speeding up subsequent builds
COPY package*.json ./
RUN npm install
# Copy all application source code
COPY . .

# STAGE 2: Production stage (Minimal image for deployment)
# Use a smaller, secure base image
FROM node:20-alpine AS final

# Set the working directory
WORKDIR /app
# Copy only the production dependencies and built application files from the builder stage
# This keeps the final image small and secure by excluding development dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/index.js .
COPY --from=builder /app/index.html .
COPY --from=builder /app/package.json .

# Expose the application port (required by the index.js server)
EXPOSE 8080

# Define the command to run the application when the container starts
CMD [ "npm", "start" ]