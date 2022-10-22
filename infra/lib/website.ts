import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

export class StaticSite extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    // const cloudfrontOAI = new cdk.aws_cloudfront.OriginAccessIdentity(this, "cloudfront-OAI", {
    //   comment: "Origin Access Identity for CloudFront",
    // });

    const subDomainName = "koodihaaste.matiasraisanen.com";
    const domainName = "matiasraisanen.com";
    const hostedZone = cdk.aws_route53.HostedZone.fromLookup(this, "Zone", {
      domainName: domainName,
    });
    // const certArn = cdk.Fn.importValue("DomainCert");
    // const domainCert = cdk.aws_certificatemanager.Certificate.fromCertificateArn(
    //   this,
    //   "domainCert",
    //   certArn
    // );

    // const certificate = new cdk.aws_certificatemanager.DnsValidatedCertificate(
    //   this,
    //   "SiteCertificate",
    //   {
    //     domainName: subDomainName,
    //     hostedZone: hostedZone,
    //     region: "us-east-1",
    //   }
    // );

    // Static bucket for the website
    const bucket = new cdk.aws_s3.Bucket(this, "Bucket", {
      publicReadAccess: false,
      blockPublicAccess: cdk.aws_s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: "solidabis-koodihaaste-2022-bucket",
      autoDeleteObjects: true,
      websiteIndexDocument: "index.html",
    });

    // Cloudfront distribution for the website bucket
    // const distribution = new cdk.aws_cloudfront.Distribution(this, "SiteDistribution", {
    //   certificate,
    //   defaultRootObject: "index.html",
    //   domainNames: [subDomainName],
    //   minimumProtocolVersion: cdk.aws_cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
    //   defaultBehavior: {
    //     origin: new cdk.aws_cloudfront_origins.S3Origin(bucket),
    //     compress: true,
    //     allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_ALL,
    //     viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    //   },
    // });

    // new cdk.CfnOutput(this, "CloudFrontUrl", {
    //   value: distribution.distributionDomainName,
    //   exportName: "CloudFrontUrl",
    // });

    new cdk.aws_s3_deployment.BucketDeployment(this, "Deploy", {
      sources: [cdk.aws_s3_deployment.Source.asset("../static")],
      destinationBucket: bucket,
    });
  }
}
