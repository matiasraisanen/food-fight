# #!/bin/bash
# # I like colours on my scripts :-)

# R='\033[0;31m' # Red
# Y='\033[0;33m' # Yellow
G='\033[0;32m' # Green
N='\033[0m'    # No Color

printf "\n"
printf "${G}* MANAGEMENT SCRIPT FOR KOODIHAASTE APPLICATION *${N}\n"
printf "\n"

# If you are not me, you should change this profile.
# More @ https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
AWS_PROFILE_NAME="myPersonalAws"

# Build static website
cd static
npm run build
cd ..

# Deploy application to AWS
cd infra
npx cdk deploy --profile $AWS_PROFILE_NAME --require-approval never --all 