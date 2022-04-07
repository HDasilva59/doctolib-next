import { ObjectID } from "bson";
import { GetServerSideProps } from "next";
import { StopPage } from "../../../component/404";
import { Layout } from "../../../component/layout";
import { getDatabase } from "../../../src/database";
import { userCategory } from "../../../src/userInfos";
import jwt_decode from "jwt-decode";
import { Card } from "react-bootstrap";
import { useState } from "react";
import { PrescriptionsForm } from "../../../component/PrescriptionsForm";


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
    const idPatient = context?.params?.index;
    const mongodb = await getDatabase();
    const patientDetails = await mongodb
      .db()
      .collection("patient")
      .findOne({ _id: new ObjectID(`${idPatient}`) })
      .then((result) => result);

    return {
      props: {
        patient: JSON.stringify(patientDetails),
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

export default function DetailsPatient(props: any) {
  const [afficheForm, setAfficheForm] = useState(<></>);

  if (props.patient !== null) {
    const data = JSON.parse(props.patient);
    return (
      <Layout>
        <div className="container">
          <Card className="cardInfoUsers">
                  <Card.Header as="h5">{data.lastName} {data.firstName}</Card.Header>
                <Card.Body>
                    <Card.Title>{data.email}</Card.Title>
                  <Card.Text>
                    {data.city} , {data.phone}
                  </Card.Text>
                </Card.Body>
              </Card>
        </div>
        <button onClick={() => setAfficheForm(< PrescriptionsForm idPatient={data._id}/>)}>
            Add a new prescription
          </button>
        <div>{afficheForm}</div>
      </Layout>
    );
  } else if (props.errorCode) {
    return <StopPage />;
  }
}
