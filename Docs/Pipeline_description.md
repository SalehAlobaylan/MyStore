## Pipeline description
<!-- 
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
  - Ensures controlled releases to production -->




### Version and Orbs
- The pipeline uses CircleCI version 2.1.
- It leverages orbs for Node.js and AWS CLI, which provide reusable commands and configurations to simplify the setup.

### Jobs
The pipeline consists of two main jobs: `build` and `deploy`.

#### Build Job
- **Container Setup:** The build job runs in a Docker container based on the `cimg/node:20.11.1` image, which includes Node.js.
- **Checkout Code:** The first step checks out the code from the repository.
- **Install Dependencies:** 
  - Installs the necessary Node.js dependencies for both the backend and frontend.
  - Installs TypeScript and Angular CLI as development dependencies.
- **Fix Vulnerabilities:** Runs `npm audit fix` to address any vulnerabilities in the installed packages.
- **Build Application:**
  - Builds the Angular frontend using the Angular CLI.
  - Compiles TypeScript files for the backend using the TypeScript compiler.
  - Creates a directory structure for deployment and copies the necessary files.
  - Generates a startup script (`start.sh`) for the AWS environment.
- **Persist Workspace:** The built files and configuration are persisted to the workspace for use in the deployment job.
- **Output NPM Log:** Outputs the NPM log files for debugging purposes.

#### Deploy Job
- **Container Setup:** The deploy job runs in a Docker container based on the `cimg/python:3.9-node` image, which includes both Python and Node.js.
- **Checkout Code:** Similar to the build job, it checks out the code from the repository.
- **Attach Workspace:** Attaches the workspace from the build job to access the built files.
- **AWS CLI Setup:** Configures the AWS CLI with the default profile.
- **Verify AWS Credentials:** 
  - Verifies that the AWS credentials are working by checking the identity of the caller.
  - Checks if the Elastic Beanstalk application and environment exist.
- **Install EB CLI:** Installs the Elastic Beanstalk Command Line Interface (EB CLI) for deployment.
- **Create Deployment Files:**
  - Creates a `Procfile` to specify how to run the application on Elastic Beanstalk.
  - Sets up the `.ebextensions` directory with configuration files for the Elastic Beanstalk environment.
  - Creates a deployment zip file containing the application and configuration files.
- **Deploy to Elastic Beanstalk:**
  - Uploads the deployment package to an S3 bucket.
  - Creates a new application version in Elastic Beanstalk.
  - Updates the Elastic Beanstalk environment with the new version.
  - Waits for the environment to update and checks the status.

### Workflow Control
- The pipeline implements a gated deployment process:
  - The `deploy` job requires the successful completion of the `build` job.
  - Deployments are restricted to the `master` branch to ensure controlled releases to production.
