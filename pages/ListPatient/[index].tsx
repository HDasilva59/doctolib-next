import { ObjectID } from "bson";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { getDatabase } from "../../src/database";
import cookie from "cookie";
import { valideTokkenId } from "../../src/verifTokken";
import { userCategory } from "../../src/userInfos";
import { useEffect, useState } from "react";
import { StopPage } from "../../component/404";
import { Layout } from "../../component/layout";
import jwt_decode from "jwt-decode";
import { Button } from "react-bootstrap";
import GeneratePDF from "../../component/Pdfgenerator";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const accessTokken = context.req.cookies.idTokken;
  let user;
  if (context.req.cookies.idTokken === undefined) {
    user = null;
  } else {
    const decoded: any = jwt_decode(accessTokken);
    user = await userCategory(decoded.email);
  }

  if (user === "medecin") {
    const idMedecin = context?.params?.index;
    const mongodb = await getDatabase();
    const arrayPatients = await mongodb
      .db()
      .collection("medecin")
      .findOne({ _id: new ObjectID(`${idMedecin}`) })
      .then((result) => result?.patients);

    const patientDetails = await Promise.all(
      arrayPatients.map(async (element: any) => {
        return await mongodb
          .db()
          .collection("patient")
          .findOne({ _id: element });
      })
    );
    const arrayPatientsString = JSON.stringify(patientDetails);
    return {
      props: {
        patient: arrayPatientsString,
      },
    };
  } else {
    return {
      props: {
        patient: null,
        errorCode: "error",
      },
    };
  }
};

export default function Login(props: any) {
  if (props.patient !== null) {
    const data = JSON.parse(props.patient);
    return (
      <Layout>
        <Link href="/">
          <a>
            <Button variant="dark">Back</Button>
          </a>
        </Link>
        <GeneratePDF data={{ name: "maxime" }}/>
        <div className="container divcontainer">
          <ul className="list-group">
            {data.map((element: any) => {
              return (
                <Link
                  key={element._id}
                  href={`/ListPatient/details/${element._id}`}
                >
                  <a>
                    <li className="list-group-item">
                      Last Name: {element.lastName}, First Name:{" "}
                      {element.firstName}
                    </li>
                  </a>
                </Link>
              );
            })}
          </ul>
        </div>
      </Layout>
    );
  } else if (props.errorCode) {
    return <StopPage />;
  }
}
