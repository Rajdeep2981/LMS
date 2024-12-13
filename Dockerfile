#Base node image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copying source files
COPY package*.json /app/

COPY . .

# Installing dependencies
RUN npm install

# Exposing port 5000
EXPOSE 5000

# Running the app
CMD ["npm", "start"]