#!/bin/bash
# Use this script to set up your CircleCI environment variables

# Replace these with your actual AWS credentials
AWS_ACCESS_KEY_ID="AKIAS7H7ETGC6G57V7B6"
AWS_SECRET_ACCESS_KEY="4jinQGw95E5H2jo2NgDBtoa+gXcsNHyJeU9KHTX8"

# Install CircleCI CLI if not already installed
if ! command -v circleci &> /dev/null; then
    echo "Installing CircleCI CLI..."
    curl -fLSs https://raw.githubusercontent.com/CircleCI-Public/circleci-cli/master/install.sh | bash
fi

# Set environment variables in CircleCI
echo "Setting CircleCI environment variables..."

# Extract GitHub username and repo from git remote URL
GITHUB_REPO_URL=$(git config --get remote.origin.url)
GITHUB_USERNAME=$(echo $GITHUB_REPO_URL | sed -n 's/.*github.com[:/]\([^/]*\).*/\1/p')
REPO_NAME=$(echo $GITHUB_REPO_URL | sed -n 's/.*\/\([^/]*\)\.git$/\1/p')

echo "Detected GitHub username: $GITHUB_USERNAME"
echo "Detected repository name: $REPO_NAME"

# Set environment variables in CircleCI
circleci context create github "$GITHUB_USERNAME/$REPO_NAME" || true
circleci context store-secret github "$GITHUB_USERNAME/$REPO_NAME" AWS_ACCESS_KEY_ID "$AWS_ACCESS_KEY_ID"
circleci context store-secret github "$GITHUB_USERNAME/$REPO_NAME" AWS_SECRET_ACCESS_KEY "$AWS_SECRET_ACCESS_KEY"
circleci context store-secret github "$GITHUB_USERNAME/$REPO_NAME" AWS_DEFAULT_REGION "us-east-1"
circleci context store-secret github "$GITHUB_USERNAME/$REPO_NAME" POSTGRES_HOST "mystoredb1.cqc8bwsn9skh.us-east-1.rds.amazonaws.com"
circleci context store-secret github "$GITHUB_USERNAME/$REPO_NAME" POSTGRES_USERNAME "postgres"
circleci context store-secret github "$GITHUB_USERNAME/$REPO_NAME" POSTGRES_PASSWORD "postgres927319"
circleci context store-secret github "$GITHUB_USERNAME/$REPO_NAME" POSTGRES_DB "postgres"

echo "Environment variables set successfully!"
echo "Please go to CircleCI web UI to verify the variables are set correctly."
