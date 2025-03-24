# Use official Node.js image
FROM node:22

# Set the working directory inside the container
WORKDIR /workspace

# Copy package.json and package-lock.json (if available)
# COPY ./package.json ./package-lock.json ./
# Copy the rest of the project files
COPY ../ /workspace
# Install dependencies
RUN npm install --save-dev


# Expose ports for API and debugging
EXPOSE 3000 9228

# Default command to start the app
CMD ["npm", "run", "start"]
