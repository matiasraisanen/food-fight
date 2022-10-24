import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

export class ApiStack extends cdk.Stack {
  public readonly api: cdk.aws_apigateway.SpecRestApi;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function for parsing food into stats
    const foodIntoStatsFn = new cdk.aws_lambda_nodejs.NodejsFunction(this, "food-into-stats", {
      functionName: "FoodIntoStats",
      bundling: {
        minify: false,
      },
      architecture: cdk.aws_lambda.Architecture.ARM_64,
      logRetention: cdk.aws_logs.RetentionDays.ONE_WEEK,
      timeout: cdk.Duration.seconds(10),
      entry: path.join(__dirname, "../lib/api.food-into-stats.ts"),
    });

    const apiGateway = new cdk.aws_apigateway.LambdaRestApi(this, "KoodihaasteApi", {
      handler: foodIntoStatsFn,
      proxy: false,
    });

    // Root route for api
    const apiRoute = apiGateway.root.addResource("api");

    // Route food-into-stats
    const apiFoodRoute = apiRoute.addResource("food-into-stats");
    apiFoodRoute.addMethod("GET", new cdk.aws_apigateway.LambdaIntegration(foodIntoStatsFn));

    // Domain names for the application
    const subDomainName = "koodihaaste.matiasraisanen.com";
    const domainName = "matiasraisanen.com";

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

    // Cloudfront for routing to S3 and ApiGW
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

    // Add a Lambda@Edge to add CORS headers to the API.
    const apiCorsLambda = new cdk.aws_cloudfront.experimental.EdgeFunction(this, "apiCors", {
      code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, "./cloudfront")),
      handler: "cors.onOriginResponse",
      runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
    });

    // Add a Lambda@Edge to rewrite paths and add redirects headers to the static site.
    const staticRewriteLambda = new cdk.aws_cloudfront.experimental.EdgeFunction(
      this,
      "staticRewrite",
      {
        code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, "./cloudfront")),
        handler: "rewrite.onViewerRequest",
        runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
      }
    );

    const cetificateARN = cdk.aws_ssm.StringParameter.valueForStringParameter(
      this,
      "CertificateARN"
    );

    const certificate = cdk.aws_certificatemanager.Certificate.fromCertificateArn(
      this,
      "Certificate",
      cetificateARN
    );

    const distribution = new cdk.aws_cloudfront.CloudFrontWebDistribution(this, "webDistribution", {
      priceClass: cdk.aws_cloudfront.PriceClass.PRICE_CLASS_100,
      viewerCertificate: cdk.aws_cloudfront.ViewerCertificate.fromAcmCertificate(certificate, {
        aliases: [subDomainName],
      }),
      originConfigs: [
        {
          customOriginSource: {
            domainName: `${apiGateway.restApiId}.execute-api.eu-west-1.${this.urlSuffix}`,
            originPath: `/${apiGateway.deploymentStage.stageName}`,
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
            s3BucketSource: staticBucket,
            originAccessIdentity: cfOriginAccessIdentity,
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

    // Configure domain koodihaaste.matiasraisanen.com to route to cloudfront
    const myHostedZone = cdk.aws_route53.HostedZone.fromLookup(this, "HostedZone", { domainName });

    new cdk.aws_route53.ARecord(this, "DomainNameAliasRecord", {
      zone: myHostedZone,
      recordName: subDomainName,
      target: cdk.aws_route53.RecordTarget.fromAlias(
        new cdk.aws_route53_targets.CloudFrontTarget(distribution)
      ),
    });

    new cdk.CfnOutput(this, "distributionDomainName", {
      value: distribution.distributionDomainName,
    });
  }
}
