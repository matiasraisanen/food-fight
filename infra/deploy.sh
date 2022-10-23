# #!/bin/bash
# # I like colours on my scripts
# D='\033[1;30m' # Dark Grey
# B='\033[0;35m' #
# O='\033[0;34m' # Orange
# R='\033[0;31m' # Red
# Y='\033[0;33m' # Yellow
# G='\033[0;32m' # Green
# N='\033[0m'    # No Color

# printf "\n"
# printf "${G}* MANAGEMENT SCRIPT FOR KOODIHAASTE APPLICATION *\n"
# printf "\n"

# If you are not me, you should change this.
# More @ https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
AWS_PROFILE_NAME="myPersonalAws"


cd static
npm run build
cd ..

npx cdk deploy --profile $AWS_PROFILE_NAME --require-approval never --all 