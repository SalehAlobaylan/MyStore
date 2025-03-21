## Infrastructure description

```
- AWS Elastic Beanstalk (EB)
  - Hosts the Node.js/Express backend API
  - Environment name: mystoreEB-dev
  - Node.js platform with v20 runtime
  - Handles auto-scaling and load balancing

- Amazon RDS PostgreSQL
  - Primary database for product and transaction data
  - Instance: mystoredb.cqc8bwsn9skh.us-east-1.rds.amazonaws.com
  - Stores persistent application data with reliable backups

- Amazon S3
  - Hosts the compiled Angular frontend as a static website
  - Stores user-uploaded product images
  - Provides highly available content delivery

- MongoDB
  - Used in development/testing environments
  - Potentially used for session management or caching
  - Configured in CircleCI for continuous integration testing

- AWS IAM
  - Manages access permissions across services
  - Provides deployment credentials for CircleCI

```

## Infrastructure Diagram

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  CircleCI       │────▶│  AWS CodeDeploy │
│  Pipeline       │     │                 │
│                 │     └────────┬────────┘
└─────────────────┘              │
                                 ▼
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     ┌─────────────────┐
│  User Browser   │◀───▶│  Amazon S3      │     │                 │
│                 │     │  (Frontend)     │     │  AWS Elastic    │
└────────┬────────┘     │                 │     │  Beanstalk      │
         │              └─────────────────┘     │  (Backend API)  │
         │                                      │                 │
         │              ┌─────────────────┐     └────────┬────────┘
         │              │                 │              │
         └─────────────▶│  API Gateway    │◀─────────────┘
                        │                 │              │
                        └────────┬────────┘              │
                                 │                       │
                        ┌────────▼────────┐     ┌────────▼────────┐
                        │                 │     │                 │
                        │  Amazon RDS     │     │  MongoDB        │
                        │  (PostgreSQL)   │     │  (Dev/Test)     │
                        │                 │     │                 │
                        └─────────────────┘     └─────────────────┘
```
