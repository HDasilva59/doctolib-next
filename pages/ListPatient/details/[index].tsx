import { ObjectID } from "bson";
import { GetServerSideProps } from "next";
import { StopPage } from "../../../component/404";
import { Layout } from "../../../component/layout";
import { getDatabase } from "../../../src/database";
import { userCategory } from "../../../src/userInfos";
import jwt_decode from "jwt-decode";


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
  if (props.patient !== null) {
    const data = JSON.parse(props.patient);
    return (
      <Layout>
        <div className="container">
          <p>Last Name : {data.lastName}</p>
          <p>First Name : {data.firstName}</p>
          <p>Email : {data.email}</p>
          <p>Phone : {data.phone}</p>
          <p>City : {data.city}</p>
        </div>
      </Layout>
    );
  } else if (props.errorCode) {
    return <StopPage />;
  }
}
