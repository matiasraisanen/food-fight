#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ApiStack } from "../lib/api-stack";
import { CertStack } from "../lib/cert-stack";

const app = new cdk.App();

const certStack = new CertStack(app, "KoodihaasteCertStack", {
  env: { account: "998999048443", region: "us-east-1" },
});

const apiStack = new ApiStack(app, "KoodihaasteInfraStack", {
  env: { account: "998999048443", region: "eu-west-1" },
});

apiStack.addDependency(certStack);
