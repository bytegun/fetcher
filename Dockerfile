# Step 1: Use a Node.js base image
FROM node:18-alpine AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if you have one)
COPY package.json ./
COPY package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your project files into the container
COPY . .

# Step 6: Build the TypeScript project
RUN npm run build

# Step 7: Use a smaller base image for the final container
FROM node:18-alpine

# Step 8: Set the working directory in the final image
WORKDIR /app

# Step 9: Copy the built files from the previous stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

# Step 10: Specify the command to run your app
CMD ["npm", "start"]
