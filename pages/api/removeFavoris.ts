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
    if (user === "patient") {
      const data = req.query.data.toString();
      const dataArray = JSON.parse(data);
      const mongodb = await getDatabase();

      for (let index = 0; index < dataArray.length; index++) {
        await mongodb
          .db()
          .collection("patient")
          .updateOne(
            { _id: new ObjectId(idUser?.toString()) },
            {
              $pull: {
                favoris: {
                  _id: dataArray[index],
                },
              },
            }
          );
      }
    }
    res.redirect(`${req.headers.referer}`);
    res.setHeader("Content-Type", "application/json");
  } else {
    res.statusCode = 405;
    res.end();
  }
}
