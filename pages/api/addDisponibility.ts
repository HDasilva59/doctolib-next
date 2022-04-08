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

    const hours = req.body.data.split("T")[1];
    const day = req.body.data.split("T")[0].split("-");
    const dayFormat = day[2] + "/" + day[1] + "/" + day[0];

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

      const addDispo = await mongodb
        .db()
        .collection("medecin")
        .updateOne(
          {
            _id: new ObjectId(idUser?.toString()),
          },
          {
            $push: {
              disponibility: {
                _id: uuidv4(),
                date: dayFormat,
                heure: hours,
                reserved: false,
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
