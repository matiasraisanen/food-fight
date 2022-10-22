#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ApiStack, WebsiteStack } from "../lib/infra-stack";

const app = new cdk.App();
const apiStack = new ApiStack(app, "KoodihaasteInfraStack", {
  env: { account: "998999048443", region: "eu-west-1" },
});

// const websiteStack = new WebsiteStack(app, "KoodihaasteWebsiteStack", {
//   env: { account: "998999048443", region: "eu-west-1" },
// });

// apiStack.addDependency(websiteStack);
