import { NextApiRequest, NextApiResponse } from "next";
import { userCategory, userIdPatient } from "../../../src/userInfos";
import jwt_decode from "jwt-decode";
import { getDatabase } from "../../../src/database";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";

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
      idUser = await userIdPatient(decoded.email);
    }
    if (user === "patient") {
      const idDisponibility = req.query.idDispo;
      console.log(
        "======================= ID DISPO ====================== " +
          idDisponibility
      );
      const mongodb = await getDatabase();
      const reservation = await mongodb
        .db()
        .collection("patient")
        .updateOne(
          {
            _id: new ObjectId(idUser?.toString()),
          },
          {
            $push: {
              reservation: {
                _id: uuidv4(),
                resa: idDisponibility,
              },
            },
          }
        );

      const modifReservationStatu = await mongodb
        .db()
        .collection("medecin")
        .updateOne(
          {
            "disponibility._id": idDisponibility,
          },
          {
            $set: {
              "disponibility.$.reserved": true,
            },
          }
        );

      const idMedecin = await mongodb
        .db()
        .collection("medecin")
        .findOne({
          "disponibility._id": idDisponibility,
        })
        .then((result) => result?._id);

      const addFavorite = await mongodb
      .db()
      .collection("patient")
      .updateOne(
        {
          _id: new ObjectId(idUser?.toString()),
        },
        {
          $push: {
            favoris: {
              _id: uuidv4(),
              favoritedoc: idMedecin,
            },
          },
        });
      res.redirect(`/doctors/details?id=${idMedecin?.toString()}`);
    }
  }
}
