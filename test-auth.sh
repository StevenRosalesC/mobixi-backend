#!/bin/bash

# Test script for the authentication system
# Make sure the server is running on http://localhost:3000

echo "🧪 Testing Authentication System"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${YELLOW}1. Testing Login with Super Admin${NC}"
echo "----------------------------------------"

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mobixi.com",
    "password": "password"
  }')

echo "Response: $LOGIN_RESPONSE"

# Extract token from response (assuming jq is available)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Failed to get token from login response${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Login successful! Token: ${TOKEN:0:20}...${NC}"

echo -e "\n${YELLOW}2. Testing Protected Endpoint (Products)${NC}"
echo "----------------------------------------"

PRODUCTS_RESPONSE=$(curl -s -X GET "$BASE_URL/products" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $PRODUCTS_RESPONSE"

if [[ $PRODUCTS_RESPONSE == *"Unauthorized"* ]] || [[ $PRODUCTS_RESPONSE == *"Forbidden"* ]]; then
    echo -e "${RED}❌ Access denied to products endpoint${NC}"
else
    echo -e "${GREEN}✅ Successfully accessed products endpoint${NC}"
fi

echo -e "\n${YELLOW}3. Testing Refresh Token${NC}"
echo "----------------------------------------"

REFRESH_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/refresh" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $REFRESH_RESPONSE"

if [[ $REFRESH_RESPONSE == *"token"* ]]; then
    echo -e "${GREEN}✅ Token refresh successful${NC}"
else
    echo -e "${RED}❌ Token refresh failed${NC}"
fi

echo -e "\n${YELLOW}4. Testing Forgot Password${NC}"
echo "----------------------------------------"

FORGOT_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mobixi.com"
  }')

echo "Response: $FORGOT_RESPONSE"

if [[ $FORGOT_RESPONSE == *"message"* ]]; then
    echo -e "${GREEN}✅ Forgot password request successful${NC}"
else
    echo -e "${RED}❌ Forgot password request failed${NC}"
fi

echo -e "\n${YELLOW}5. Testing Invalid Token${NC}"
echo "----------------------------------------"

INVALID_RESPONSE=$(curl -s -X GET "$BASE_URL/products" \
  -H "Authorization: Bearer invalid-token")

echo "Response: $INVALID_RESPONSE"

if [[ $INVALID_RESPONSE == *"Unauthorized"* ]]; then
    echo -e "${GREEN}✅ Invalid token properly rejected${NC}"
else
    echo -e "${RED}❌ Invalid token not properly handled${NC}"
fi

echo -e "\n${GREEN}🎉 Authentication system test completed!${NC}"
echo "==================================" 