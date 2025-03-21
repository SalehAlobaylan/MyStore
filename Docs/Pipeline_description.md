## Pipeline description

- Version and Orbs: The pipeline uses CircleCI 2.1 with Node.js, AWS Elastic Beanstalk, and AWS CLI orbs

- Build Job: Handles building and testing in a containerized environment

  - Uses Node.js and MongoDB containers
  - Installs dependencies and builds both front-end and back-end
  - Tests API connectivity

- Deploy Job: Handles deployment to AWS Elastic Beanstalk

  - Sets up AWS CLI and Elastic Beanstalk CLI tools
  - Rebuilds the application and deploys to the mystoreEB-dev environment

- Workflow Control: Implements a gated deployment process
  - Requires manual approval before deployment
  - Only deploys from the master branch
  - Ensures controlled releases to production
