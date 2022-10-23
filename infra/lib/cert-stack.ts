import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import { Api } from "./api";
// import { StaticSite } from "./website";
import * as path from "path";
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

    new CrossRegionParameter(this, 'CertificateARN', {
      region: 'eu-west-1',
      name: 'CertificateARN',
      description: 'ARN for subdomain certificate',
      value: certificate.certificateArn,
    });
  }
}
