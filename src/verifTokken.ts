export async function valideTokkenId(tokken: string) {
  const tokkenData = await fetch(`${process.env.AUTH0_DOMAIN}/userinfo`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokken}`,
    },
  })
    .then((element) => element.json())
    .then((result) => result.email)
    .catch(() => false);

  return tokkenData;
}
