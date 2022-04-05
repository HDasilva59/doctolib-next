import { ObjectID } from "bson";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { getDatabase } from "../../src/database";
import cookie from "cookie";
import { userCategory } from "../../src/userInfos";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { StopPage } from "../../component/404";
import { Layout } from "../../component/layout";

export const getServerSideProps: GetServerSideProps = async (context) => {
const accessTokken = context.req.cookies.idTokken;
  let user;
  if (context.req.cookies.idTokken === undefined) {
    user = null
  }
  else {
    const decoded: any = jwt_decode(accessTokken);
   user =  await userCategory(decoded.email)
 }

  if (user === "medecin") {

  const idMedecin = context?.params?.index
  const mongodb = await getDatabase();
  const planningMedecin = await mongodb.db().collection("medecin").findOne({ _id: new ObjectID(`${idMedecin}`) })
    .then((result) => result?.disponibility)

    return {
    props: {
      planning: planningMedecin,
      errorCode:"nothing"
    }
  };
  } else {
     return {
    props: {
        patient: null,
        errorCode: "error"
    }
  };
  }
}

export default function Calendar(props: any) {
  if (props.errorCode === "nothing") {

    return <Layout>

    </Layout>;
  } else if (props.errorCode === "error") {
    return <StopPage />
  }
}
