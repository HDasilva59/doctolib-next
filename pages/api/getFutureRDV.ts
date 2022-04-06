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
    const patientInfo = await mongodb
      .db()
      .collection("patient")
      .findOne({ _id: new ObjectId(req.query.data.toString()) })
      .then((result) => result?.reservation);

    const detailsResa = await Promise.all(
      patientInfo.map(async (element: any) => {
        return await mongodb
          .db()
          .collection("medecin")
          .findOne({
            "disponibility._id": element.resa,
          })
          .then((result) => result?.disponibility)
          .then((disponibility) => {
            return disponibility.map((dispo: any, index: number) => {
              if (dispo._id === element.resa) {
                return {
                  date: dispo.date,
                  heure: dispo.heure,
                  id: element.resa,
                };
              }
            });
          });
      })
    );
    const dataResa: any = [];
    detailsResa.forEach((element: any, index: number) => {
      element.forEach((detail: any) => {
        if (detail !== undefined) {
          dataResa.push(detail);
        }
      });
    });

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ data: dataResa }));
  } else {
    res.statusCode = 405;
    res.end();
  }
}
