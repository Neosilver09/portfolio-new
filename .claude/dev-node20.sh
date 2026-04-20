#!/bin/bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 20 --silent
cd /Users/anishan/Documents/Projects/portfolio-anishan
exec npx next dev --port 3001
