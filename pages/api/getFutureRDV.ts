import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../src/database";
import jwt_decode from "jwt-decode";
import { userCategory, userId } from "../../src/userInfos";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const mongodb = await getDatabase();
    const medecin = await mongodb
      .db()
      .collection("medecin")
      .find()
      .toArray()

console.log(medecin)
    res.redirect(`${req.headers.referer}`);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ data: medecin}));
  } else {
    res.statusCode = 405;
    res.end();
  }
}
