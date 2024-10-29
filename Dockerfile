# Step 1: Base image
FROM node:20.16.0-alpine3.19

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Expose the Next.js default port
EXPOSE 3000

# Step 7: Start the Next.js app in development mode
CMD ["npm", "run", "dev"]
