# #!/bin/bash

# We want to bail on errors. If test fail, deployment will not be carried out.
set -e


# Some colours to make the print prettier
G='\033[0;32m' # Green
N='\033[0m'    # No Color

printf "\n"
printf "${G}* MANAGEMENT SCRIPT FOR KOODIHAASTE APPLICATION *${N}\n"
printf "\n"

# If you are not me, you should change this profile.
# More @ https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
AWS_PROFILE_NAME="myPersonalAws"

# Run all the tests
(cd infra && npm run test)

# Build static website
(cd static && npm run build)

# Deploy application to AWS
(cd infra && npx cdk deploy --profile $AWS_PROFILE_NAME --require-approval never --all )