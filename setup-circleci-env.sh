#!/bin/bash

echo "Setting up CircleCI environment variables..."

# First, check if CircleCI CLI is installed
if ! command -v circleci &> /dev/null; then
    echo "Installing CircleCI CLI..."
    curl -fLSs https://raw.githubusercontent.com/CircleCI-Public/circleci-cli/master/install.sh | bash
fi

# Setup CircleCI token
if [ -z "$CIRCLE_TOKEN" ]; then
    echo "Please enter your CircleCI Personal API Token (create one at https://circleci.com/account/api):"
    read -s CIRCLE_TOKEN
    export CIRCLE_TOKEN
fi

# Configure CircleCI CLI
echo "Configuring CircleCI CLI..."
circleci setup --token $CIRCLE_TOKEN

# Get organization ID
echo "Getting organization ID..."
ORG_SLUG=$(git config --get remote.origin.url | sed -n 's/.*github.com[:/]\([^/]*\).*/\1/p')
ORG_INFO=$(curl -s -H "Circle-Token: $CIRCLE_TOKEN" "https://circleci.com/api/v2/me/collaborations")
ORG_ID=$(echo $ORG_INFO | jq -r ".items[] | select(.name==\"$ORG_SLUG\") | .id")

if [ -z "$ORG_ID" ]; then
    echo "Could not find organization ID. Please enter it manually:"
    read ORG_ID
fi

# Create context
CONTEXT_NAME="mystore-env"
echo "Creating context '$CONTEXT_NAME'..."
circleci context create --org-id "$ORG_ID" "$CONTEXT_NAME"

# Set environment variables
echo "Setting environment variables..."
circleci context store-secret --org-id "$ORG_ID" "$CONTEXT_NAME" "AWS_ACCESS_KEY_ID" "$AWS_ACCESS_KEY_ID"
circleci context store-secret --org-id "$ORG_ID" "$CONTEXT_NAME" "AWS_SECRET_ACCESS_KEY" "$AWS_SECRET_ACCESS_KEY"
circleci context store-secret --org-id "$ORG_ID" "$CONTEXT_NAME" "AWS_DEFAULT_REGION" "us-east-1"
circleci context store-secret --org-id "$ORG_ID" "$CONTEXT_NAME" "POSTGRES_HOST" "$POSTGRES_HOST"
circleci context store-secret --org-id "$ORG_ID" "$CONTEXT_NAME" "POSTGRES_USERNAME" "postgres"
circleci context store-secret --org-id "$ORG_ID" "$CONTEXT_NAME" "POSTGRES_PASSWORD" "$POSTGRES_PASSWORD"
circleci context store-secret --org-id "$ORG_ID" "$CONTEXT_NAME" "POSTGRES_DB" "postgres"

echo "Environment variables set successfully!"