import { NextApiRequest, NextApiResponse } from "next";
import jwt_decode from "jwt-decode";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const accessTokken = req.cookies.idTokken;
    let response = "false";
    if (accessTokken !== undefined) {
      response = "true";
    }

    res.end(response);
  } else {
    res.statusCode = 405;
    res.end();
  }
}
