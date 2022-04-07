import { ObjectID } from "bson";
import { GetServerSideProps } from "next";
import jwt_decode from "jwt-decode";
import { userCategory } from "../../../src/userInfos";
import { getDatabase } from "../../../src/database";
import { Layout } from "../../../component/layout";
import { StopPage } from "../../../component/404";
import Link from "next/link";
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
    const idDisponibility = context?.params?.index;
    const mongodb = await getDatabase();
    const infoReservation = await mongodb.db().collection("patient").findOne({
      "reservation.resa": idDisponibility,
    });

    let data;
    if (infoReservation === undefined) {
      data = [];
    } else {
      data = infoReservation;
    }

    return {
      props: {
        data: JSON.stringify(data),
        lastURL: context.req.headers.referer,
        errorCode: "nothing",
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

export default function Calendar(props: any) {
  if (props.errorCode === "nothing") {
    const data = JSON.parse(props.data);
    return (
      <Layout>
        <Link href={`${props.lastURL}`}>
          <a>
            <Button variant="dark">Back</Button>
          </a>
        </Link>
        <div className="container">
                <Card className="cardInfoUsers">
                  <Card.Header as="h5">Dr {data.lastName} {data.firstName}</Card.Header>
            <Card.Body>

                    <Card.Title>{data.email}</Card.Title>
                  <Card.Text>
                    {data.city} , phone : {data.phone}
                  </Card.Text>
                </Card.Body>
              </Card>
        </div><br /><br />
        <form
          className="container"
          method="POST"
          action={`/api/doctors/sendEmail`}
        >
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="exampleFormControlInput1"
              name="email"
              value={data.email}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea
              className="form-control"
              id="formArea"
              name="formArea"
            ></textarea>
            <button type="submit" className="btn btn-primary mb-3">
              Send Email
            </button>
          </div>
        </form>
      </Layout>
    );
  } else if (props.errorCode === "error") {
    return <StopPage />;
  }
}
