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
      // const mongodb = await getDatabase();
      // await mongodb
      //   .db()
      //   .collection("medecin")
      //   .updateOne(
      //     { _id: new ObjectId(idUser?.toString()) },
      //     {
      //       $pullAll: {
      //         disponibility: {
      //           _id: [dataArray],
      //         },
      //       },
      //     }
      //   );
    }
    res.redirect("/");
    res.setHeader("Content-Type", "application/json");
  } else {
    res.statusCode = 405;
    res.end();
  }
}
