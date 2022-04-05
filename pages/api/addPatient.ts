import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../src/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const mongodb = await getDatabase();

    const medecin = await mongodb.db().collection("patient").insertOne({
      lastName: req.body.last,
      firstName: req.body.first,
      email: req.body.email,
      city: req.body.ville,
      phone: req.body.phone,
    });

    res.redirect("/");
    res.setHeader("Content-Type", "application/json");
  } else {
    res.statusCode = 405;
    res.end();
  }
}
