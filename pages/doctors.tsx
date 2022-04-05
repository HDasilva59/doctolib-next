import { ObjectID } from "bson";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { getDatabase } from "../src/database";
import cookie from "cookie";
import { userCategory } from "../src/userInfos";
import { useEffect, useState } from "react";
import { StopPage } from "../component/404";
import { Layout } from "../component/layout";
import jwt_decode from "jwt-decode";
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const mongodb = await getDatabase();
  const arrayMedecins = await mongodb
    .db()
    .collection("medecin")
    .findOne({ lastName: context.query.name })
    .then((result) => result?.patients);

  const medecinDetails = await Promise.all(
    arrayMedecins.map(async (element: any) => {
      return await mongodb.db().collection("medecin").findOne({ _id: element });
    })
  );
  const arrayMedecinsString = JSON.stringify(medecinDetails);
  console.log("==================================================" + " " + arrayMedecins)
  return {
    props: {
      medecin: arrayMedecinsString,
    },
  };
};

export default function Login(props: any) {
  if (props.patient !== null) {
    const data = JSON.parse(props.medecin);
    //console.log("===================================== this is data line 37 =====================" + " " + data)
    return (
      <Layout>
        <Link href="/">
          <a>
            <button>Back</button>
          </a>
        </Link>
        <div className="container">
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
