import { NextApiRequest, NextApiResponse } from "next";
import jwt_decode from "jwt-decode";
import { userCategory, userId, userIdPatient } from "../../src/userInfos";
import { getDatabase } from "../../src/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const accessTokken = req.cookies.idTokken;
    const decoded: any = jwt_decode(accessTokken);
    const category = await userCategory(decoded.email);
    let infoUser;
    const mongodb = await getDatabase();

    if (category === "patient") {
      const id = await userIdPatient(decoded.email);
      infoUser = await mongodb.db().collection("patient").findOne({ _id: id });
    } else if (category === "medecin") {
      const id = await userId(decoded.email);
      infoUser = await mongodb.db().collection("medecin").findOne({ _id: id });
    }
    res.end(JSON.stringify(infoUser));
  } else {
    res.statusCode = 405;
    res.end();
  }
}
