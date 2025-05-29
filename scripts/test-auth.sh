#!/bin/bash

# This script tests the authentication flow
echo "Testing authentication flow..."

# Run test with ts-node
npx ts-node src/auth/tests/auth-test.ts
