import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../src/database";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const mongodb = await getDatabase();
    const patientFavoris = await mongodb
      .db()
      .collection("patient")
      .findOne({ _id: new ObjectId(req.query.data.toString()) })
      .then((result) => {
        return result?.favoris.filter(function (ele: any, pos: any) {
          if (pos === 0) {
            return ele;
          } else {
            if (
              ele.favoritedoc.toString() !==
              result?.favoris[pos - 1].favoritedoc.toString()
            ) {
              return ele;
            }
          }
        });
      });

    const detailFavoris = await Promise.all(
      patientFavoris.map(async (element: any) => {
        return await mongodb
          .db()
          .collection("medecin")
          .findOne({ _id: element.favoritedoc });
      })
    );

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ data: detailFavoris }));
  } else {
    res.statusCode = 405;
    res.end();
  }
}
