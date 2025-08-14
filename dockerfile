# Stage 1: Base image
FROM node:20

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Compile TypeScript
RUN npx tsc -b

# Expose the backend port
EXPOSE 3000

# Run the compiled server
CMD ["node", "./dist/server.js"]
