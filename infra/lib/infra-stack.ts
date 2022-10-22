import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Api } from "./api";
export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Static bucket for the website
    new cdk.aws_s3.Bucket(this, "Bucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: "solidabis-koodihaaste-2022-bucket",
    });

    // ApiGateway API
    const api = new Api(this, "Api", {
      env: { account: "998999048443", region: "eu-west-1" },
    });
  }
}
