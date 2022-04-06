import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../src/database";
import { ObjectId } from "mongodb";
import moment from "moment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const toDay = moment().format("DD/MM/YYYY");

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

    const dataResaFuture: any = [];
    const dataResaPast: any = [];
    detailsResa.forEach((element: any, index: number) => {
      element.forEach((detail: any) => {
        if (detail !== undefined) {
          if (moment(toDay).isAfter(`${detail.date}`)) {
            dataResaPast.push(detail);
          } else {
            dataResaFuture.push(detail);
          }
        }
      });
    });

    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({ dataFuture: dataResaFuture, dataPast: dataResaPast })
    );
  } else {
    res.statusCode = 405;
    res.end();
  }
}
