import { NextApiRequest, NextApiResponse } from "next";
import jwt_decode from "jwt-decode";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { userCategory, userId } from "../../../src/userInfos";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const accessTokken = req.cookies.idTokken;
    let user;
    let idUser;
    let decoded: any;
    if (req.cookies.idTokken === undefined) {
      user = null;
    } else {
      decoded = jwt_decode(accessTokken);
      user = await userCategory(decoded.email);
      idUser = await userId(decoded.email);
    }
    if (user === "medecin") {
      const sgMail = require("@sendgrid/mail");
      sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);
      const msg = {
        to: `${req.body.email}`,
        from: `${decoded.email}`,
        subject: "Information",
        text: `${req.body.formArea}`,
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent !!");
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
    res.redirect("/");
  } else {
    res.statusCode = 405;
    res.end();
  }
}
