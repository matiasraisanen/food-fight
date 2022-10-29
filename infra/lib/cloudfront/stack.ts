import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

export class CloudFrontStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Add a Lambda@Edge to add CORS headers to the API.
    const apiCorsLambda = new cdk.aws_cloudfront.experimental.EdgeFunction(this, "apiCors", {
      code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, "./")),
      handler: "cors.onOriginResponse",
      runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
    });

    // Add a Lambda@Edge to rewrite paths and add redirects headers to the static site.
    const staticRewriteLambda = new cdk.aws_cloudfront.experimental.EdgeFunction(
      this,
      "staticRewrite",
      {
        code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, "./")),
        handler: "rewrite.onViewerRequest",
        runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
      }
    );

    // Get certicate from us-east-1
    const certificateARN = cdk.aws_ssm.StringParameter.valueForStringParameter(
      this,
      "CertificateARN"
    );

    const certificate = cdk.aws_certificatemanager.Certificate.fromCertificateArn(
      this,
      "Certificate",
      certificateARN
    );

    // Domain names for the application
    const subDomainName = "koodihaaste.matiasraisanen.com";
    const domainName = "matiasraisanen.com";

    // Configure domain subdomain koodihaaste.matiasraisanen.com to route to cloudfront
    const myHostedZone = cdk.aws_route53.HostedZone.fromLookup(this, "HostedZone", { domainName });

    const apiGatewayID = cdk.Fn.importValue("ApiGatewayApiID");
    const ApiGatewayDeploymentStage = cdk.Fn.importValue("ApiGatewayDeploymentStage");

    // Create cloudfront distribution
    const distribution = new cdk.aws_cloudfront.CloudFrontWebDistribution(this, "webDistribution", {
      priceClass: cdk.aws_cloudfront.PriceClass.PRICE_CLASS_100,
      viewerCertificate: cdk.aws_cloudfront.ViewerCertificate.fromAcmCertificate(certificate, {
        aliases: [subDomainName],
      }),
      originConfigs: [
        {
          customOriginSource: {
            domainName: `${apiGatewayID}.execute-api.eu-west-1.${this.urlSuffix}`,
            originPath: `/${ApiGatewayDeploymentStage}`,
          },
          behaviors: [
            {
              lambdaFunctionAssociations: [
                {
                  lambdaFunction: apiCorsLambda,
                  eventType: cdk.aws_cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE,
                },
              ],
              allowedMethods: cdk.aws_cloudfront.CloudFrontAllowedMethods.ALL,
              pathPattern: "api/*",
              minTtl: cdk.Duration.millis(0),
              defaultTtl: cdk.Duration.millis(0),
              maxTtl: cdk.Duration.millis(0),
              forwardedValues: {
                queryString: true,
              },
            },
          ],
        },
        {
          s3OriginSource: {
            s3BucketSource: cdk.aws_s3.Bucket.fromBucketAttributes(this, "staticBucket", {
              bucketArn: cdk.Fn.importValue("StaticBucketArn"),
            }),

            originAccessIdentity:
              cdk.aws_cloudfront.OriginAccessIdentity.fromOriginAccessIdentityId(
                this,
                "staticBucketOAI",
                cdk.Fn.importValue("StaticBucketOAI")
              ),
          },
          behaviors: [
            {
              lambdaFunctionAssociations: [
                {
                  lambdaFunction: staticRewriteLambda,
                  eventType: cdk.aws_cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
                },
              ],
              isDefaultBehavior: true,
            },
          ],
        },
      ],
    });

    // Create an A record for the distribution
    new cdk.aws_route53.ARecord(this, "DomainNameAliasRecord", {
      zone: myHostedZone,
      recordName: subDomainName,
      target: cdk.aws_route53.RecordTarget.fromAlias(
        new cdk.aws_route53_targets.CloudFrontTarget(distribution)
      ),
    });
  }
}
