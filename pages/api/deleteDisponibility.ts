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
    const accessTokken = req.cookies.idTokken;
    let user;
    let idUser;
    if (req.cookies.idTokken === undefined) {
      user = null;
    } else {
      const decoded: any = jwt_decode(accessTokken);
      user = await userCategory(decoded.email);
      idUser = await userId(decoded.email);
    }
    if (user === "medecin") {
      const data = req.query.data.toString();
      const dataArray = JSON.parse(data);
      const mongodb = await getDatabase();

      for (let index = 0; index < dataArray.length; index++) {
        await mongodb
          .db()
          .collection("medecin")
          .updateOne(
            { _id: new ObjectId(idUser?.toString()) },
            {
              $pull: {
                disponibility: {
                  _id: dataArray[index],
                },
              },
            }
          );
        await mongodb
          .db()
          .collection("patient")
          .updateOne(
            {
              "reservation.resa": dataArray[index],
            },
            {
              $pull: {
                reservation: {
                  resa: dataArray[index],
                },
              },
            }
          );
      }
    } else if (user === "patient") {
      const data = req.query.data.toString();
      const dataArray = JSON.parse(data);
      const mongodb = await getDatabase();

      const modifReservationStatu = await mongodb
        .db()
        .collection("medecin")
        .updateOne(
          {
            "disponibility._id": dataArray[0],
          },
          {
            $set: {
              "disponibility.$.reserved": false,
            },
          }
        );

      await mongodb
        .db()
        .collection("patient")
        .updateOne(
          {
            "reservation.resa": dataArray[0],
          },
          {
            $pull: {
              reservation: {
                resa: dataArray[0],
              },
            },
          }
        );
    }
    res.redirect(`${req.headers.referer}`);
  } else {
    res.statusCode = 405;
    res.end();
  }
}
