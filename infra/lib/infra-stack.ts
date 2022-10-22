import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Api } from "./api";
import { StaticSite } from "./website";
export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ApiGateway API
    const api = new Api(this, "Api", {
      env: { account: "998999048443", region: "eu-west-1" },
    });
  }
}

export class WebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const website = new StaticSite(this, "Website", {
      env: { account: "998999048443", region: "eu-west-1" },
    });
  }
}
