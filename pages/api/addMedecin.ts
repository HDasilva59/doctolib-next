import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../src/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const mongodb = await getDatabase();

    const medecin = await mongodb
      .db()
      .collection("medecin")
      .insertOne({
        lastName: req.body.last,
        firstName: req.body.first,
        email: req.body.email,
        phone: req.body.phone,
        city: req.body.ville,
        tarif: parseInt(req.body.tarif),
        speciality: req.body.spe,
        disponibility: [],
        patients: [],
      });

    res.redirect("/");
  } else {
    res.statusCode = 405;
    res.end();
  }
}
