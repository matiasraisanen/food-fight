#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { InfraStack } from "../lib/infra-stack";

const app = new cdk.App();
new InfraStack(app, "KoodihaasteInfraStack", {
  env: { account: "998999048443", region: "eu-west-1" },
});
