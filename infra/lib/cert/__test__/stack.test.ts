import { Template, Match } from "aws-cdk-lib/assertions";
import { createCdkTestContext } from "../../../__test__/test-context-provider";

import { CertStack } from "../stack";

describe("Infrastructure", () => {
  describe("CertStack", () => {
    const tc = createCdkTestContext();
    const apiStack = new CertStack(tc, "TestStack", {
      env: { account: "123456789012", region: "eu-west-1" },
    });
    const template = Template.fromStack(apiStack);

    test("Certificate is created for koodihaaste.matiasraisanen.com", () => {
      template.hasResourceProperties("AWS::CertificateManager::Certificate", {
        DomainName: "koodihaaste.matiasraisanen.com",
      });
    });

    test("Exports CertificateARN as custom resource", () => {
      template.hasResourceProperties("Custom::AWS", {
        ServiceToken: Match.anyValue(),
      });
    });
  });
});
