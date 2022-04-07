import { ObjectID } from "bson";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { getDatabase } from "../../src/database";
import { userCategory } from "../../src/userInfos";
import { StopPage } from "../../component/404";
import { Layout } from "../../component/layout";
import jwt_decode from "jwt-decode";
import { Button, Card } from "react-bootstrap";

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
      .findOne({ _id: new ObjectID(idMedecin?.toString())})
      .then((result) => result?.patients);

    if (arrayPatients !== undefined) {
      const patientDetails = await Promise.all(
        arrayPatients.map(async (element: any) => {
          return await mongodb
            .db()
            .collection("patient")
            .findOne({ _id: new ObjectID(element.patientId?.toString()) })
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
          patient: "aucun",
        },
      };
    }
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
    if (props.patient !== "aucun") {
      const data = JSON.parse(props.patient);

      return (
        <Layout>
          <Link href="/">
            <a>
              <Button variant="dark">Back</Button>
            </a>
          </Link>
          <div className="container">
            <ul className="list-group">
              {data.map((element: any) => {
                return (
                  <Card key={element._id}>
                  <Card.Header as="h5">
                    Dr {element.lastName} {element.firstName}
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>{element.email}</Card.Title>
                    <Card.Text>
                      {element.city} , {element.phone}
                    </Card.Text>
                    <Button variant="primary">
                      <Link href={`/ListPatient/details/${element._id}`}>
                        <a>More Infos</a>
                      </Link>
                    </Button>
                  </Card.Body>
                </Card>
                );
              })}
            </ul>
          </div>
        </Layout>
      );
    } else {
      <Layout>

      </Layout>
    }
  } else if (props.errorCode) {
    return <StopPage />;
  }
}
