# Img base nodejs
FROM node:20.11.0

# Dir
WORKDIR /app

# Copy all 
COPY . .

# Install 
RUN npm install

# Expose
EXPOSE 3000

# Run proyect
CMD ["npm", "start"]