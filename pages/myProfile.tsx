import { ObjectID } from "mongodb";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { Layout } from "../component/layout";
import { getDatabase } from "../src/database";
import { userCategory } from "../src/userInfos";
import styles from "../styles/Home.module.css";
import jwt_decode from "jwt-decode";
import GeneratePDF from "../component/Pdfgenerator";
import { Dropdown } from "react-bootstrap";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const accessTokken = context.req.cookies.idTokken;
  let user;
  if (context.req.cookies.idTokken === undefined) {
    user = null;
  } else {
    const decoded: any = jwt_decode(accessTokken);
    user = await userCategory(decoded.email);
  }

  if (user === "patient") {
    const decoded: any = jwt_decode(accessTokken);
    user = await userCategory(decoded.email);
    const mongodb = await getDatabase();
    const patientInfo = await mongodb
      .db()
      .collection("patient")
      .findOne({ email: decoded.email })
      .then((result) => result);

    const patientPrescriptions = await mongodb
      .db()
      .collection("patient")
      .findOne({ email: decoded.email })
      .then((result) => result?.prescriptions);


    return {
      props: {
        user:"patient",
        patient: JSON.stringify(patientInfo),
        arrayPrescriptions: JSON.stringify(patientPrescriptions)
      },
    };
  } else if (user === "medecin") {
    const decoded: any = jwt_decode(accessTokken);
    user = await userCategory(decoded.email);
    const mongodb = await getDatabase();
    const medecinInfo = await mongodb
      .db()
      .collection("medecin")
      .findOne({ email: decoded.email })
      .then((result) => result);

    return {
      props: {
        user:"medecin",
        patient: JSON.stringify(medecinInfo),
      },
    };
  } else {
    return {
      props: {
        user:null,
        patient: null,
        errorCode: "error",
      },
    };
  }
};

export default function Login(props: any) {

  if (props.user === "patient") {
    const data = JSON.parse(props.patient);
    const dataPrescriptions = JSON.parse(props.arrayPrescriptions);
    return (
      <Layout>
        <div className="container">
          <form action="/api/modifyPatient" method="post">
            <div className="mb-3 mt-3">
              <label className="form-label">Your First Name:</label>
              <input type="hidden" name="id" id="id" value={data._id} />
              <input
                type="text"
                className="form-control"
                id="first"
                value={data.firstName}
                name="first"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name:</label>
              <input
                type="text"
                className="form-control"
                id="last"
                value={data.lastName}
                name="last"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input
                type="text"
                className="form-control"
                id="email"
                value={data.email}
                name="email"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone number:</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                defaultValue={data.phone}
                name="phone"/>
            </div>
            <div className="mb-3">
              <label className="form-label">City:</label>
              <input
                type="text"
                className="form-control"
                id="ville"
                defaultValue={data.city}
                name="ville"
              />
            </div>
            <div className="form-check mb-3"></div>
            <button type="submit" className="btn btn-primary">
              Modify
            </button>
          </form>

          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              My Prescription
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {dataPrescriptions.map((element:any) => {
                return (
                  <Dropdown.Item key={`${element._id}`}><GeneratePDF data={JSON.stringify(element)} /></Dropdown.Item>
                )
              })}

            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Layout>
    );
  }else if (props.user === "medecin") {
    const data = JSON.parse(props.patient);
    return (
      <Layout>
        <div className="container">
          <form action="/api/modifyPatient" method="post">
            <div className="mb-3 mt-3">
              <label className="form-label">Your First Name:</label>
              <input type="hidden" name="id" id="id" value={data._id} />
              <input
                type="text"
                className="form-control"
                id="first"
                value={data.firstName}
                name="first"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name:</label>
              <input
                type="text"
                className="form-control"
                id="last"
                value={data.lastName}
                name="last"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input
                type="text"
                className="form-control"
                id="email"
                value={data.email}
                name="email"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone number:</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                defaultValue={data.phone}
                name="phone"/>
            </div>
            <div className="mb-3">
              <label className="form-label">City:</label>
              <input
                type="text"
                className="form-control"
                id="ville"
                defaultValue={data.city}
                name="ville"
              />
            </div>
            <div className="form-check mb-3"></div>
            <button type="submit" className="btn btn-primary">
              Modify
            </button>
          </form>
        </div>
      </Layout>
    );
  }
}
