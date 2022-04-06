import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../src/database";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const param = req.query.code;

    //get the tokken
    const tokkenData = await fetch(`${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=authorization_code&client_id=${process.env.AUTH0_CLIENT_ID}&client_secret=${process.env.AUTH0_CLIENT_SECRET}&code=${param}&redirect_uri=${process.env.AUTH0_REDIRECTURI_PATIENTS}`,
    })
      .then((element) => element.json())
      .then((tokken) => tokken);

    //Create cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("idTokken", tokkenData.id_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 60,
        sameSite: "lax",
        path: "/",
      })
    );

    const userInfo = await fetch(`${process.env.AUTH0_DOMAIN}/userinfo`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${tokkenData.access_token}`,
      },
    })
      .then((element) => element.json())
      .then((user) => user);

    const mongodb = await getDatabase();
    const userFound = await mongodb.db().collection("users").findOne({
      email: userInfo.email,
    });
    if (userFound === null) {
      const mongodb = await getDatabase();
      const createUser = await mongodb.db().collection("users").insertOne({
        email: userInfo.email,
        lastName: userInfo.family_name,
        firstName: userInfo.given_name,
        category: "patient",
      });
      res.redirect("/formPatient");
    } else {
      res.status(200).redirect(`/`);
    }
  } else {
    res.statusCode = 405;
    res.end();
  }
}
