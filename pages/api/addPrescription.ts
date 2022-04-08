import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../src/database";
import jwt_decode from "jwt-decode";
import { userCategory, userId } from "../../src/userInfos";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
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
      const mongodb = await getDatabase();
      const patient = req.query.id;

      const medecin = await mongodb
        .db()
        .collection("medecin")
        .findOne({ "disponibility._id": req.body.resa });

      const addPrescription = await mongodb
        .db()
        .collection("patient")
        .updateOne(
          {
            _id: new ObjectId(patient?.toString()),
          },
          {
            $push: {
              prescriptions: {
                _id: uuidv4(),
                date: req.body.date,
                resaId: req.body.resa,
                contenu: req.body.formArea,
                firstNameDoctor: medecin?.firstName,
                lastNameDoctor: medecin?.lastName,
                emailDoctor: medecin?.email,
                specialityDoctor: medecin?.speciality,
                cityDoctor: medecin?.city,
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
