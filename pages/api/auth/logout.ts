import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const url = `${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=http://localhost:3000/`;
    console.log(url);
    // await fetch(
    //   url
    // )

    res.setHeader("Content-Type", "application/json");
    res.redirect(url);
    res.end(JSON.stringify({ cookie: "cookie" }));
  } else {
    res.statusCode = 405;
    res.end();
  }
}
