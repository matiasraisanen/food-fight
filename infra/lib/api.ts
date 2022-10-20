import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

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

    // Policy for retrieving the API key from secrets manager
    const retrieveSecretPolicy = new cdk.aws_iam.PolicyStatement({
      actions: ["secretsmanager:GetSecretValue"],
      resources: ["API_KEY_ARN"],
    });

    foodIntoStatsFn.role?.attachInlinePolicy(
      new cdk.aws_iam.Policy(this, "getApiKeyPolicy", {
        statements: [retrieveSecretPolicy],
      })
    );

    // Configure domain koodihaaste.matiasraisanen.com
    const domainName = "koodihaaste.matiasraisanen.com";

    const myHostedZone = new cdk.aws_route53.HostedZone(this, "HostedZone", {
      zoneName: "matiasraisanen.com",
    });

    const certificate = new cdk.aws_certificatemanager.Certificate(this, "Certificate", {
      domainName,
      validation: cdk.aws_certificatemanager.CertificateValidation.fromDns(myHostedZone),
    });

    // Create API Gateway domain
    const domain = new cdk.aws_apigateway.DomainName(this, "ApiGwDomainName", {
      domainName,
      certificate,
      endpointType: cdk.aws_apigateway.EndpointType.REGIONAL,
    });

    // Map the domain into Route53 base domain zone as a record
    new cdk.aws_route53.ARecord(this, "DomainNameAliasRecord", {
      zone: myHostedZone,
      recordName: domainName,
      target: cdk.aws_route53.RecordTarget.fromAlias(
        new cdk.aws_route53_targets.ApiGatewayDomain(domain)
      ),
    });
  }
}
