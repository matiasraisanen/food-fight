import { Template } from "aws-cdk-lib/assertions";
import { createCdkTestContext } from "../../../__test__/test-context-provider";

import { ApiStack } from "../stack";

describe("Infrastructure", () => {
  describe("ApiStack", () => {
    const tc = createCdkTestContext();
    const apiStack = new ApiStack(tc, "TestStack");
    const template = Template.fromStack(apiStack);

    test("Koodihaaste ApiGateway API is created", () => {
      template.hasResourceProperties("AWS::ApiGateway::RestApi", {
        Name: "KoodihaasteApi",
      });
    });

    test("Lambda handler is created", () => {
      template.hasResourceProperties("AWS::Lambda::Function", {
        FunctionName: "FoodIntoStats",
      });
    });
  });
});
