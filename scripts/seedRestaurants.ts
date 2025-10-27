import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { mockRestaurants } from "@/mocks/restaurants";

export async function seedRestaurants() {
  const colRef = collection(db, "restaurants");
  for (const restaurant of mockRestaurants) {
    await setDoc(doc(colRef, restaurant.id), restaurant);
  }
  console.log("✅ Restaurants data uploaded!");
}
