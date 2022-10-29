import { Template, Match } from "aws-cdk-lib/assertions";
import { createCdkTestContext } from "../../../__test__/test-context-provider";

import { CloudFrontStack } from "../stack";

describe("Infrastructure", () => {
  describe("CloudFrontStack", () => {
    const tc = createCdkTestContext();
    const apiStack = new CloudFrontStack(tc, "TestStack", {
      env: { account: "123456789012", region: "eu-west-1" },
    });

    const template = Template.fromStack(apiStack);

    test("Creates Route53 A-record for koodihaaste.matiasraisanen.com", () => {
      template.hasResourceProperties("AWS::Route53::RecordSet", {
        Name: "koodihaaste.matiasraisanen.com.",
        Type: "A",
      });
    });

    test("Creates Cloudfront distribution", () => {
      template.hasResourceProperties("AWS::CloudFront::Distribution", {
        DistributionConfig: {
          Aliases: ["koodihaaste.matiasraisanen.com"],
        },
      });
    });
  });
});
