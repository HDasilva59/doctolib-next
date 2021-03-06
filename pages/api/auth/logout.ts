import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const url = `${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${process.env.AUTH0_BASE_URL}`;

    //destroy cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("idTokken", "null", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 0,
        sameSite: "strict",
        path: "/",
      })
    );
    res.redirect(url);
  } else {
    res.statusCode = 405;
    res.end();
  }
}
