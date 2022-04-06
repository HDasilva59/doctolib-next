import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../src/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    console.log(req.body.id);
    const mongodb = await getDatabase();
    const medecin = await mongodb
      .db()
      .collection("patient")
      .updateOne(
        {
          _id: new ObjectId(req.body.id),
        },
        {
          $set: {
            lastName: req.body.last,
            firstName: req.body.first,
            email: req.body.email,
            city: req.body.ville,
            phone: req.body.phone,
          },
        }
      );

    res.redirect("/");
  } else {
    res.statusCode = 405;
    res.end();
  }
}
