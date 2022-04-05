import { getDatabase } from "./database";

export async function userCategory(userInfo: string) {
  const mongodb = await getDatabase();
  const userFound = await mongodb
    .db()
    .collection("users")
    .findOne({
      email: userInfo,
    })
    .then((result) => result?.category);
  return userFound;
}

export async function userId(userInfo: string) {
  const mongodb = await getDatabase();
  const userIdFound = await mongodb
    .db()
    .collection("medecin")
    .findOne({
      email: userInfo,
    })
    .then((result) => result?._id);
  return userIdFound;
}

export async function userIdPatient(userInfo: string) {
  const mongodb = await getDatabase();
  const userIdFound = await mongodb
    .db()
    .collection("patient")
    .findOne({
      email: userInfo,
    })
    .then((result) => result?._id);
  return userIdFound;
}
