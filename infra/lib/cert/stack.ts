import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CrossRegionParameter } from "@alma-cdk/cross-region-parameter";

export class CertStack extends cdk.Stack {
  public readonly api: cdk.aws_apigateway.SpecRestApi;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myHostedZone = cdk.aws_route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: "matiasraisanen.com",
    });

    const certificate = new cdk.aws_certificatemanager.Certificate(this, "Certificate", {
      domainName: "koodihaaste.matiasraisanen.com",
      validation: cdk.aws_certificatemanager.CertificateValidation.fromDns(myHostedZone),
    });

    // Output certificate ARN for cloudfront
    // new cdk.CfnOutput(this, "CertificateARN", {
    //   value: apiGateway.deploymentStage.stageName,
    // });

    // We are using ALMA's open sourced helper library here to create a cross region parameter to store the certificate ARN.
    // This is needed because the certificate is created in us-east-1 and the API Gateway is created in eu-west-1.
    new CrossRegionParameter(this, "CertificateARN", {
      region: "eu-west-1",
      name: "CertificateARN",
      description: "ARN for subdomain certificate",
      value: certificate.certificateArn,
    });
  }
}
