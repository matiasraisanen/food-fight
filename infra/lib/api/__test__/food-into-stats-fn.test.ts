import { foodIntoStats, FoodCharacter } from "../food-into-stats-fn";

jest.mock("../food-into-stats-fn", () => {
  return {
    foodIntoStats: jest.fn().mockImplementation(() => Promise.resolve()),
  };
});

const foodIntoStatsMock = foodIntoStats as jest.MockedFunction<typeof foodIntoStats>;

const foodResponse: FoodCharacter = {
  originalName: "Omena, ulkomainen, kuorineen",
  hp: 38.852571462547175,
  damage: 8.19540006637573,
  defense: 0.165299997925758,
  wait: 8.447700065597887,
  aps: 0.1183754148744419,
  dps: 0.9701338829192556,
};

describe("Application", () => {
  beforeEach(() => {
    foodIntoStatsMock.mockReset();
  });

  describe("Get food stats", () => {
    test("Successful call", async () => {
      foodIntoStatsMock.mockResolvedValue(foodResponse);

      const res = await foodIntoStats("-");

      expect(res).toMatchObject(foodResponse);
    });
  });
});
