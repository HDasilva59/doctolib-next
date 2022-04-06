import app from "next/app";
import { NextApiRequest, NextApiResponse } from "next";
import { responseSymbol } from "next/dist/server/web/spec-compliant/fetch-event";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const url = `${process.env.AUTH0_DOMAIN}/authorize?client_id=${process.env.AUTH0_CLIENT_ID}&response_type=code&redirect_uri=${process.env.AUTH0_REDIRECTURI}&audience=${process.env.AUTH0_AUDIENCE}&scope=${process.env.AUTH0_SCOPES}`;

    res.redirect(url);
  } else {
    res.statusCode = 405;
    res.end();
  }
}
