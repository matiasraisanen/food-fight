import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as openapix from "@alma-cdk/openapix";
import * as path from "path";

export class Api extends Construct {
  public readonly api: cdk.aws_apigateway.SpecRestApi;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    // Lambda function for parsing food into stats
    const foodIntoStatsFn = new cdk.aws_lambda_nodejs.NodejsFunction(this, "food-into-stats", {
      functionName: "FoodIntoStats",
      bundling: {
        minify: false,
      },
      architecture: cdk.aws_lambda.Architecture.ARM_64,
      logRetention: cdk.aws_logs.RetentionDays.ONE_WEEK,
      timeout: cdk.Duration.seconds(10),
      entry: path.join(__dirname, "../src/food-into-stats.ts"),
      handler: "get",
    });

    const apiGateway = new cdk.aws_apigateway.LambdaRestApi(this, "ApiGateway", {
      handler: foodIntoStatsFn,
      proxy: false,
    });

    // /api route
    const apiRoute = apiGateway.root.addResource("api");

    // api/food-into-stats
    const apiFoodRoute = apiRoute.addResource("food-into-stats");
    apiFoodRoute.addMethod("GET", new cdk.aws_apigateway.LambdaIntegration(foodIntoStatsFn));

    // Configure domain koodihaaste.matiasraisanen.com
    const domainName = "koodihaaste.matiasraisanen.com";

    // const myHostedZone = new cdk.aws_route53.HostedZone(this, "HostedZone", {
    //   zoneName: "matiasraisanen.com",
    // });
    const myHostedZone = cdk.aws_route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: "matiasraisanen.com",
    });

    const certificate = new cdk.aws_certificatemanager.Certificate(this, "Certificate", {
      domainName: "koodihaaste.matiasraisanen.com",
      validation: cdk.aws_certificatemanager.CertificateValidation.fromDns(myHostedZone),
    });

    // Create API Gateway domain
    const domain = new cdk.aws_apigateway.DomainName(this, "ApiGwDomainName", {
      domainName: "koodihaaste.matiasraisanen.com",
      certificate,
      endpointType: cdk.aws_apigateway.EndpointType.REGIONAL,
    });

    new cdk.CfnOutput(this, "Domain", {
      value: domain.domainName,
    });

    // Map the domain into Route53 base domain zone as a record
    new cdk.aws_route53.ARecord(this, "DomainNameAliasRecord", {
      zone: myHostedZone,
      recordName: domainName,
      target: cdk.aws_route53.RecordTarget.fromAlias(
        new cdk.aws_route53_targets.ApiGatewayDomain(domain)
      ),
    });

    const staticBucket = new cdk.aws_s3.Bucket(this, "Bucket", {
      publicReadAccess: true,
      // blockPublicAccess: cdk.aws_s3.BlockPublicAccess.BLOCK_ALL,
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

    const distribution = new cdk.aws_cloudfront.CloudFrontWebDistribution(this, "webDistribution", {
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
              maxTtl: cdk.Duration.millis(0),
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
    new cdk.CfnOutput(this, "distributionDomainName", {
      value: distribution.distributionDomainName,
    });

    // const api = new openapix.Api(this, "KoodihaasteAPI", {
    //   source: path.join(__dirname, "./schema.yaml"),
    //   paths: {
    //     "/api/food-into-stats": {
    //       get: new openapix.LambdaIntegration(this, foodIntoStatsFn),
    //     },
    //     "/": {
    //       get: new openapix.HttpIntegration(this, staticBucket.bucketWebsiteUrl, {
    //         httpMethod: "get",
    //       }),
    //     },
    //     "/static": {
    //       get: new openapix.HttpIntegration(this, `${staticBucket.bucketWebsiteUrl}/static`, {
    //         httpMethod: "get",
    //       }),
    //     },
    //     "/images": {
    //       get: new openapix.HttpIntegration(this, `${staticBucket.bucketWebsiteUrl}/images`, {
    //         httpMethod: "get",
    //       }),
    //     },
    //   },
    // });

    // new cdk.aws_apigateway.BasePathMapping(this, "BasePathMapping", {
    //   domainName: domain,
    //   restApi: api,
    // });

    // this.api = api;
  }
}
