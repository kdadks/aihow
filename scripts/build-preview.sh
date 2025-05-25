#!/bin/bash

# Build Preview Script for AIhow
# This script builds the project and runs a local preview server

# Color codes for output formatting
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
CYAN="\033[0;36m"
NC="\033[0m" # No Color

echo -e "${CYAN}=== AIhow Build Preview ===${NC}"
echo -e "${YELLOW}Building project...${NC}"

# Run the build
npm run build

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Build successful!${NC}"
  echo -e "${YELLOW}Starting preview server...${NC}"
  
  # Run the preview server
  npm run preview -- --port 3000
else
  echo -e "\033[0;31mBuild failed. Please check the errors above.${NC}"
  exit 1
fi
