import { Template, Match } from "aws-cdk-lib/assertions";
import { createCdkTestContext } from "../../../__test__/test-context-provider";

import { StaticWebsiteStack } from "../stack";

describe("Infrastructure", () => {
  describe("StaticWebsiteStack", () => {
    const tc = createCdkTestContext();
    const apiStack = new StaticWebsiteStack(tc, "TestStack", {
      env: { account: "123456789012", region: "eu-west-1" },
    });

    const template = Template.fromStack(apiStack);

    test("Creates S3 static website bucket", () => {
      template.hasResourceProperties("AWS::S3::Bucket", {
        BucketName: "food-fight-2022-bucket",
      });
    });
  });
});
