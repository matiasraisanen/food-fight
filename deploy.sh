# #!/bin/bash

# We want to bail on errors. If test fail, deployment will not be carried out.
set -e

# Some colours to make the print prettier
G='\033[0;32m' # Green
N='\033[0m'    # Neutral

printf "${G}\n"
printf "   ╓── DEPLOYMENT SCRIPT FOR KOODIHAASTE APPLICATION\n"
printf "   ║ Automated steps:\n"
printf "   ╠═> 1. Run tests\n"
printf "   ╠══> 2. Build static website\n"
printf "   ╠═══> 3. Deploy application to AWS\n"
printf "   ╚════> 4. Run e2e tests\n"
printf "${N}\n"


# Run all tests
(cd infra && npm run test Infrastructure && npm run test Application)

# Build static website
(cd static && npm run build)

# Deploy application to AWS
### Setup AWS profile name
AWS_PROFILE_NAME="myPersonalAws"

(cd infra && npx cdk deploy --outputs-file ./outputs/cfnOutputs.json --profile $AWS_PROFILE_NAME --require-approval never --all)

# Run e2e test after deployment
(cd infra && npm run test End-to-end)