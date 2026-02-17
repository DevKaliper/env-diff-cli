#!/bin/bash

# envdiff Demo Script
# This script demonstrates all the features of envdiff

set -e

echo "========================================="
echo "  envdiff - Environment Diff Tool Demo"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

demo_command() {
  echo -e "${BLUE}$ $1${NC}"
  eval "$1"
  echo ""
}

echo -e "${GREEN}1. Basic Diff - Compare development and production${NC}"
demo_command "node dist/cli.js diff src/__tests__/fixtures/.env.test src/__tests__/fixtures/.env.production"

echo -e "${GREEN}2. Diff with Masked Values${NC}"
demo_command "node dist/cli.js diff src/__tests__/fixtures/.env.test src/__tests__/fixtures/.env.production --no-values"

echo -e "${GREEN}3. Diff - JSON Format${NC}"
demo_command "node dist/cli.js diff src/__tests__/fixtures/.env.test src/__tests__/fixtures/.env.production --format json | head -20"

echo -e "${GREEN}4. Diff - Markdown Format${NC}"
demo_command "node dist/cli.js diff src/__tests__/fixtures/.env.test src/__tests__/fixtures/.env.production --format markdown"

echo -e "${GREEN}5. Audit - Security Issues${NC}"
demo_command "node dist/cli.js audit src/__tests__/fixtures/.env.suspicious || true"

echo -e "${GREEN}6. Check - Missing Variables${NC}"
demo_command "node dist/cli.js check src/__tests__/fixtures/.env.production --baseline src/__tests__/fixtures/.env.example || true"

echo -e "${GREEN}7. Integration - Docker Compose${NC}"
demo_command "node dist/cli.js diff compose:src/__tests__/fixtures/docker-compose.yml src/__tests__/fixtures/.env.production | head -20"

echo -e "${GREEN}8. Integration - Vercel${NC}"
demo_command "node dist/cli.js diff vercel:src/__tests__/fixtures/vercel.json src/__tests__/fixtures/.env.test"

echo -e "${GREEN}9. Integration - Railway${NC}"
demo_command "node dist/cli.js diff railway:src/__tests__/fixtures/railway.toml src/__tests__/fixtures/.env.production"

echo ""
echo "========================================="
echo "  Demo Complete!"
echo "========================================="
