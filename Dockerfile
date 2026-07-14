FROM mcr.microsoft.com/playwright:v1.50.1-noble

# Set working directory
WORKDIR /app

# Copy dependency definition files
COPY package.json package-lock.json ./

# Install npm packages (including devDependencies)
RUN npm ci

# Copy the rest of the project files
COPY . .

# Ensure run.sh is executable
RUN chmod +x run.sh

# Default environment variables
ENV ENV=qa
ENV BROWSER=chrome
ENV HEADLESS=true
ENV TEST_SUITE=all

# Set run.sh as the entrypoint
ENTRYPOINT ["./run.sh"]
