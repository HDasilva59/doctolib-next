import { ObjectID } from "bson";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { StopPage } from "../../../component/404";
import { Layout } from "../../../component/layout";
import { getDatabase } from "../../../src/database";
import {Modal, ModalBody, ModalFooter } from "reactstrap";
import { useState } from "react";
import jwt_decode from "jwt-decode";
import { userCategory } from "../../../src/userInfos";
import { Button, Card } from "react-bootstrap";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const idMedecin = context.query.id;
  const mongodb = await getDatabase();
  const accessTokken = context.req.cookies.idTokken;
  let user;
  if (context.req.cookies.idTokken === undefined) {
    user = null;
  } else {
    const decoded: any = jwt_decode(accessTokken);
    user = await userCategory(decoded.email);
  }

  const medecinDetails = await mongodb
    .db()
    .collection("medecin")
    .findOne({ _id: new ObjectID(`${idMedecin}`) })
    .then((result) => result);

  let backUrl;
  if (context.req.headers.referer === `${process.env.AUTH0_BASE_URL}/`) {
    backUrl = `${process.env.AUTH0_BASE_URL}/`;
  } else {
    backUrl = `${process.env.AUTH0_BASE_URL}/doctors?speciality=${medecinDetails?.speciality}&city=${medecinDetails?.city}`;
  }

  return {
    props: {
      patient: JSON.stringify(medecinDetails),
      speciality: backUrl,
      category:user
    },
  };
};

export default function DetailsPatient(props: any) {
  const [modalOpen, setModalOpen] = useState(false);

  if (props.patient !== null) {
    const data = JSON.parse(props.patient);
    return (
      <Layout>
        <Link href={`${props.speciality}`}>
          <a>
            <Button variant="dark">Back</Button>
          </a>
        </Link>
        <div className="container">
                <Card className="cardInfoUsers">
                  <Card.Header as="h5">Dr {data.lastName} {data.firstName}</Card.Header>
                <Card.Body>
                    <Card.Title>{data.speciality}</Card.Title>
                  <Card.Text>
                    {data.city} , {data.tarif} € / hours
                  </Card.Text>
                </Card.Body>
              </Card>
          <br />
          <br />
          <br />
          <h3>Disponibility :</h3>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
              </tr>
            </thead>
            <tbody>
              {data.disponibility.map((element: any, index: number) => {
                if (element.reserved === false) {
                  return (
                    <tr key={element._id}>
                      <th scope="row">{index + 1}</th>
                      <td>{element.date}</td>
                      <td>{element.heure}</td>
                      <td>
                        <>
                          {props.category === "patient" ? <Button
                            color="primary"
                            type="button"
                            onClick={() => setModalOpen(!modalOpen)}
                          >
                            Reserve
                          </Button> : <Link href="/api/auth/loginpatients"><a><Button
                            color="primary"
                            type="button"
                          >
                            Reserve
                          </Button></a></Link>}
                          <Modal
                            toggle={() => setModalOpen(!modalOpen)}
                            isOpen={modalOpen}
                          >
                            <div className=" modal-header">
                              <h5
                                className=" modal-title"
                                id="exampleModalLabel"
                              >
                                Validation
                              </h5>
                              <button
                                aria-label="Close"
                                className=" close"
                                type="button"
                                onClick={() => setModalOpen(!modalOpen)}
                              >
                                <span aria-hidden={true}>×</span>
                              </button>
                            </div>
                            <ModalBody>Confirm Your Reservation.</ModalBody>
                            <ModalFooter>
                              <Button
                                color="secondary"
                                type="button"
                                onClick={() => setModalOpen(!modalOpen)}
                              >
                                No
                              </Button>
                              <Link
                                href={`/api/reservation?idDispo=${element._id}`}
                              >
                                <a>
                                  <Button color="primary" type="button">
                                    Yes
                                  </Button>
                                </a>
                              </Link>
                            </ModalFooter>
                          </Modal>
                        </>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </Layout>
    );
  } else if (props.errorCode) {
    return <StopPage />;
  }
}
