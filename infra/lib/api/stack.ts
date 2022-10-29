import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

export class ApiStack extends cdk.Stack {
  public readonly api: cdk.aws_apigateway.SpecRestApi;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function for parsing food into stats
    const foodIntoStatsFn = new cdk.aws_lambda_nodejs.NodejsFunction(this, "food-into-stats", {
      functionName: "FoodIntoStats",
      bundling: {
        minify: false,
      },
      architecture: cdk.aws_lambda.Architecture.ARM_64,
      logRetention: cdk.aws_logs.RetentionDays.ONE_WEEK,
      timeout: cdk.Duration.seconds(10),
      entry: path.join(__dirname, "../api/food-into-stats-fn.ts"),
    });

    // Rest API
    const apiGateway = new cdk.aws_apigateway.LambdaRestApi(this, "KoodihaasteApi", {
      handler: foodIntoStatsFn,
      proxy: false,
    });

    // Root route for api: {sub}.{domain}/api
    const apiRoute = apiGateway.root.addResource("api");

    // Route food-into-stats: {sub}.{domain}/api/food-into-stats
    const apiFoodRoute = apiRoute.addResource("food-into-stats");
    apiFoodRoute.addMethod("GET", new cdk.aws_apigateway.LambdaIntegration(foodIntoStatsFn));

    // Output API Gateway API ID for cloudfront
    new cdk.CfnOutput(this, "ApiGatewayApiID", {
      exportName: "ApiGatewayApiID",
      value: apiGateway.restApiId,
    });

    // Output API Gateway deployment stage name for cloudfront
    new cdk.CfnOutput(this, "ApiGatewayDeploymentStage", {
      exportName: "ApiGatewayDeploymentStage",
      value: apiGateway.deploymentStage.stageName,
    });
  }
}
