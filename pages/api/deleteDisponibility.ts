import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../src/database";
import jwt_decode from "jwt-decode";
import { userCategory, userId } from "../../src/userInfos";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const accessTokken = req.cookies.idTokken;
    let user;
    let idUser;
    if (req.cookies.idTokken === undefined) {
      user = null
    }
    else {
      const decoded: any = jwt_decode(accessTokken);
      user =  await userCategory(decoded.email)
      idUser= await userId(decoded.email);
   }
    if (user === "medecin") {
      console.log(req.body);
      // const mongodb = await getDatabase();

      // const addDispo = await mongodb
      //     .db()
      //     .collection("medecin")
      //     .updateOne(
      //       {
      //         _id: new ObjectId(idUser?.toString()),
      //       },
      //       {
      //         $push: {
      //           disponibility: {
      //             date: req.body.date,
      //             heure: req.body.heure,
      //           },
      //         },
      //       }
      //     );
    }
    res.redirect("/");
    res.setHeader("Content-Type", "application/json");
  } else {
    res.statusCode = 405;
    res.end();
  }
}