import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

// Create an S3 bucket for the website deployment, and add required access permissions
export class StaticWebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const staticBucket = new cdk.aws_s3.Bucket(this, "Bucket", {
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: "solidabis-koodihaaste-2022-bucket",
      autoDeleteObjects: true,
    });

    new cdk.aws_s3_deployment.BucketDeployment(this, "Deploy", {
      sources: [cdk.aws_s3_deployment.Source.asset("../static/build")],
      destinationKeyPrefix: "/",
      destinationBucket: staticBucket,
    });

    const cfOriginAccessIdentity = new cdk.aws_cloudfront.OriginAccessIdentity(
      this,
      "cfOriginAccessIdentity",
      {}
    );

    const cloudfrontS3Access = new cdk.aws_iam.PolicyStatement();
    cloudfrontS3Access.addActions("s3:GetBucket*");
    cloudfrontS3Access.addActions("s3:GetObject*");
    cloudfrontS3Access.addActions("s3:List*");
    cloudfrontS3Access.addResources(staticBucket.bucketArn);
    cloudfrontS3Access.addResources(`${staticBucket.bucketArn}/*`);
    cloudfrontS3Access.addCanonicalUserPrincipal(
      cfOriginAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
    );
    staticBucket.addToResourcePolicy(cloudfrontS3Access);

    // Output S3 bucket ARN for main stack
    new cdk.CfnOutput(this, "StaticBucketArn", {
      exportName: "StaticBucketArn",
      value: staticBucket.bucketArn,
    });

    // Output OAI
    new cdk.CfnOutput(this, "staticBucketOAI", {
      exportName: "StaticBucketOAI",
      value: cfOriginAccessIdentity.originAccessIdentityId,
    });
  }
}
