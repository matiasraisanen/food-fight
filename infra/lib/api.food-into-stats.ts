import { Logger } from "@aws-lambda-powertools/logger";
import { Context, APIGatewayEvent } from "aws-lambda";
import fetch from "node-fetch";
import type { FetchError, Response } from "node-fetch";

const logger = new Logger({
  serviceName: "FoodIntoStatsLambda",
  logLevel: "DEBUG",
});

interface ResponseError extends Error {
  code?: number;
}

type foodCharacter = {
  name: string;
  energy: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  cooldown: number;
};

// Function for parsing food into stats
async function foodIntoStats(food: string): Promise<foodCharacter | ResponseError> {
  // Get nutritional information from the Food API
  const response: any = await fetch(`https://fineli.fi/fineli/api/v1/foods?q=${food}`, {
    method: "GET",
  })
    .then((res: Response) => res.json())
    .catch((err: FetchError) => logger.error("Error during fetch", err as ResponseError));

  // try {
  logger.debug(`Response length from Food API: ${response.length}`);
  if (response.length == 0) {
    let err = new Error(`No food called '${food}' found in Fineli`) as ResponseError;
    err.code = 404;
    return err;
  }

  // Find the item which has the food in its most unprocessed form
  let foodItem = response.find(
    (item: any) => item.type.code === "FOOD" && item.preparationMethod[0].code === "RAW"
  );
  logger.debug("Food item after FIND", foodItem);

  // If no such item is found, we will just fallback to the item's first definition
  if (!foodItem) {
    logger.debug("No RAW food item found, falling back to first item");
    foodItem = response[0];
  }

  // Create the player character
  const character: foodCharacter = {
    name: foodItem.name.fi,
    energy: foodItem.energyKcal,
    carbohydrate: foodItem.carbohydrate,
    protein: foodItem.protein,
    fat: foodItem.fat,
    cooldown: foodItem.carbohydrate + foodItem.protein + foodItem.fat,
  };
  logger.debug("Player character created", JSON.stringify(character));
  return character;
}

exports.handler = async (event: APIGatewayEvent, context: Context) => {
  let food: string;

  try {
    if (event.queryStringParameters && event.queryStringParameters.food) {
      food = event.queryStringParameters.food;
      logger.debug(`Food item to search for: ${food}`);
      const character = await foodIntoStats(food);

      if (character instanceof Error) {
        return {
          statusCode: character.code,
          body: JSON.stringify({
            statusCode: character.code,
            message: character.message,
          }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          statusCode: 200,
          message: "success",
          data: character,
        }),
      };
    } else {
      throw new Error("No food item provided");
    }
  } catch (err: any) {
    logger.error("Error during character creation", JSON.stringify(err.message));
    return {
      statusCode: 500,
      body: JSON.stringify({
        statusCode: 500,
        message: err.message,
      }),
    };
  }
};
