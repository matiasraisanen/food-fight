import { ICdkOutputs, getOutputValue, readCdkOutput } from "./cdk-outputs";
import got from "got";

describe("End-to-End", () => {
  let apiUrl: string;
  let outputs: ICdkOutputs | undefined;

  beforeAll(async () => {
    outputs = readCdkOutput();

    if (!outputs) {
      test("The outputs json does not exist", () => {
        expect(1).toBe(0);
      });
      return;
    }

    const apiDomain = getOutputValue(outputs, "KoodihaasteApiStack", "ApiGatewayApiURL");

    // Set the API url
    apiUrl = `${apiDomain}/api/food-into-stats`;
  });

  beforeEach(() => {
    // Requests can sometimes take more than default 5 seconds
    jest.setTimeout(10000);
  });

  describe("API", () => {
    describe("GET request", () => {
      test("Successful GET food", async () => {
        let response = await got(apiUrl, {
          searchParams: {
            food: "omena",
          },
          headers: {},
          throwHttpErrors: false,
        }).json();

        expect(response).toMatchObject({
          statusCode: 200,
          message: "success",
          data: {
            originalName: "Omena, ulkomainen, kuorineen",
            hp: 38.852571462547175,
            damage: 8.19540006637573,
            defense: 0.165299997925758,
            wait: 8.447700065597887,
            aps: 0.1183754148744419,
            dps: 0.9701338829192556,
          },
        });
      });

      test("Failed GET when no food provided", async () => {
        let response = await got(apiUrl, {
          searchParams: {},
          headers: {},
          throwHttpErrors: false,
        }).json();

        expect(response).toMatchObject({
          statusCode: 500,
          message: "No food item provided",
        });
      });

      test("Failed GET when no food is found with given parameter", async () => {
        let response = await got(apiUrl, {
          searchParams: {
            food: "thisfooddoesnotexist",
          },
          headers: {},
          throwHttpErrors: false,
        }).json();

        expect(response).toMatchObject({
          statusCode: 404,
          message: "No food called 'thisfooddoesnotexist' found in Fineli",
        });
      });
    });
  });
});
