import { ObjectID } from "bson";
import { GetServerSideProps } from "next";
import { StopPage } from "../../../component/404";
import { Layout } from "../../../component/layout";
import { getDatabase } from "../../../src/database";
import { userCategory, userId } from "../../../src/userInfos";
import jwt_decode from "jwt-decode";
import { Button, Card, ListGroup } from "react-bootstrap";
import { useState } from "react";
import { PrescriptionsForm } from "../../../component/PrescriptionsForm";


export const getServerSideProps: GetServerSideProps = async (context) => {

  const accessTokken = context.req.cookies.idTokken;
  let user;
  let idUser:any;
  if (context.req.cookies.idTokken === undefined) {
    user = null;
  } else {
    const decoded: any = jwt_decode(accessTokken);
    user = await userCategory(decoded.email);
    idUser = await userId(decoded.email);
  }
  if (user === "medecin") {
    const idPatient = context?.params?.index;
    const mongodb = await getDatabase();
    const patientDetails = await mongodb
      .db()
      .collection("patient")
      .findOne({ _id: new ObjectID(`${idPatient}`) })
      .then((result) => result);

    const reservationsPatient = await mongodb
      .db()
      .collection("patient")
      .findOne({ _id: new ObjectID(`${idPatient}`) })
      .then((result) => result?.reservation);

    const resaOfPatientWithDoctor = reservationsPatient?.filter((element: any) => element.iddoctor === idUser.toString());

    const resaDetail = await Promise.all(
      resaOfPatientWithDoctor?.map(async (element: any) => {
         return await mongodb
          .db()
          .collection("medecin")
          .findOne({ _id: new ObjectID(`${idUser.toString()}`) })
           .then((result) => result?.disponibility)
           .then((disponibility) => {
             return disponibility.filter((resaelement:any) =>resaelement._id === element.resa)
           });
      })
    )

    return {
      props: {
        patient: JSON.stringify(patientDetails),
        resa: JSON.stringify(resaDetail),
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
    const dataResa = JSON.parse(props.resa);
console.log("-----------------------",dataResa[0])
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
                  <ul className="list-group" style={{marginTop:"50px"}}>
          {dataResa.map((element: any) => {
                        return (
                          <div key={element[0]._id} className="container">
                            <ListGroup>
                              <ListGroup.Item variant="success">
                                <div className="row">
                                  <div className="col-6">
                                  Date: {element[0].date} --------------------- Heure :{element[0].heure}
                                  </div>
                                  <div className="col-6 buttonInfo">
                                    <Button onClick={() => setAfficheForm(< PrescriptionsForm idPatient={data._id} resa={element[0]._id} date={element[0].date}/>)} variant="outline-success">Add Prescription</Button>
                                  </div>
                              </div>
                              </ListGroup.Item>
                            </ListGroup>
                          </div>
                        );

                    })}
                  </ul>
        <div>{afficheForm}</div>
      </Layout>
    );
  } else if (props.errorCode) {
    return <StopPage />;
  }
}
