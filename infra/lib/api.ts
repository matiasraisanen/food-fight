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
      environment: {
        ENV_VAR_01: "value",
      },
      logRetention: cdk.aws_logs.RetentionDays.ONE_WEEK,
      timeout: cdk.Duration.seconds(10),
    });

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

    const api = new openapix.Api(this, "KoodihaasteAPI", {
      source: path.join(__dirname, "./schema.yaml"),
      paths: {
        "/api/food-into-stats": {
          get: new openapix.LambdaIntegration(this, foodIntoStatsFn),
        },
      },
    });

    new cdk.aws_apigateway.BasePathMapping(this, "BasePathMapping", {
      domainName: domain,
      restApi: api,
    });

    this.api = api;
  }
}
