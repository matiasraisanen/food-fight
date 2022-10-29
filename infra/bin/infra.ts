#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ApiStack } from "../lib/api/stack";
import { CertStack } from "../lib/cert/stack";
import { StaticWebsiteStack } from "../lib/s3/stack";
import { CloudFrontStack } from "../lib/cloudfront/stack";
import { CloudFormationStackDriftDetectionCheck } from "aws-cdk-lib/aws-config";

const app = new cdk.App();

const ENV_EU_WEST_1 = {
  env: { account: "998999048443", region: "eu-west-1" },
};

const ENV_US_EAST_1 = {
  env: { account: "998999048443", region: "us-east-1" },
};

const certStack = new CertStack(app, "KoodihaasteCertStack", ENV_US_EAST_1);

const staticWebsiteStack = new StaticWebsiteStack(
  app,
  "KoodihaasteStaticWebsiteStack",
  ENV_EU_WEST_1
);

const apiStack = new ApiStack(app, "KoodihaasteInfraStack", ENV_EU_WEST_1);

const cloudfrontStack = new CloudFrontStack(app, "KoodihaasteCloudFrontStack", ENV_EU_WEST_1);

apiStack.addDependency(certStack);
apiStack.addDependency(staticWebsiteStack);
cloudfrontStack.addDependency(apiStack);
cloudfrontStack.addDependency(staticWebsiteStack);
