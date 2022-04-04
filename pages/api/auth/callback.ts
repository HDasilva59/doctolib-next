import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    res.setHeader("Content-Type", "application/json");
    res.redirect("/form")
    res.end(JSON.stringify({ cookie: "cookie" }));
  } else {
    res.statusCode = 405;
    res.end();
  }
}
