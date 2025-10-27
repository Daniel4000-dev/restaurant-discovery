import { seedRestaurants } from "@/scripts/seedRestaurants";
import { setDoc, doc } from "firebase/firestore";
import { mockRestaurants } from "@/mocks/restaurants";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  setDoc: jest.fn(() => Promise.resolve()),
  doc: jest.fn(),
}));

describe("seedRestaurants", () => {
  it("uploads all restaurants to Firestore", async () => {
    await seedRestaurants();
    expect(setDoc).toHaveBeenCalledTimes(mockRestaurants.length);
  });
});
