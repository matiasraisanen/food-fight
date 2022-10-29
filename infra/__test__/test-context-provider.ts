import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

// import * as cdk from "@aws-cdk/core";
// import * as lambda from "@aws-cdk/aws-lambda";
// import * as route53 from "@aws-cdk/aws-route53";
// import * as s3 from "@aws-cdk/aws-s3";

// import { IBucket } from "@aws-cdk/aws-s3";
import { readFileSync } from "fs";

const cdkJson = JSON.parse(readFileSync("./cdk.json", "utf-8"));

class TestContextProvider extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.node.setContext("account", "mock");
    this.node.setContext("environment", "mock1");
    this.node.setContext("defaultRegion", cdkJson.context.defaultRegion);
    this.node.setContext("project", cdkJson.context.project);
    this.node.setContext("accounts", cdkJson.context.accounts);
  }
}

export class DependencyProviderStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  }
}

/**Creates a CDK construct with all the required context fro running tests and assigns it into a CDK app. */
export function createCdkTestContext(): Construct {
  const app = new cdk.App();
  const testContextProvider = new TestContextProvider(app, "TestContextProvider");
  return testContextProvider;
}

/**Creates a S3 Bucket construct within given scope */
export function createBucketDependency(scope: Construct): {
  staticBucket: cdk.aws_s3.IBucket;
} {
  const depStack = new DependencyProviderStack(scope, "DependencyProviderStack3");
  const staticBucket = new cdk.aws_s3.Bucket(depStack, "TestBucket");
  return { staticBucket };
}

export function createLambdaDependency(scope: Construct): cdk.aws_lambda.Function {
  const depStack = new DependencyProviderStack(scope, "DependencyProviderStack5");
  return new cdk.aws_lambda.Function(depStack, "TestFunction", {
    runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
    handler: "mock",
    code: cdk.aws_lambda.Code.fromInline("mock"),
  });
}

/**Creates a mocked hosted zone */
export function createMockedHostedZone(scope: Construct): cdk.aws_route53.IHostedZone {
  const depStack = new DependencyProviderStack(scope, "MockProviderStack");

  const mockedHostedZone = new cdk.aws_route53.HostedZone(depStack, "MockedZone", {
    zoneName: "mockedzonename",
  });

  return mockedHostedZone;
}
