import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Layout } from "../component/layout";
import { userCategory, userId, userIdPatient } from "../src/userInfos";
import styles from "../styles/Home.module.css";
import jwt_decode from "jwt-decode";
import { getDatabase } from "../src/database";

export const getServerSideProps: GetServerSideProps = async (context) => {
  let user;
  let idUser;
  let decoded: any;
  const accessTokken = context.req.cookies.idTokken;

  const mongodb = await getDatabase();
  const medecin = await mongodb
    .db()
    .collection("medecin")
    .find()
    .toArray()
    .then((result) => result);

  const city = medecin?.map(function (ele: any, pos: any) {
    return ele.city;
  });
  const arrayFilter = Array.from(new Set(city));

  const typeArrayFilter = arrayFilter.join();

  if (accessTokken !== undefined) {
    decoded = jwt_decode(accessTokken.toString());
    user = await userCategory(decoded.email);
    idUser = await userId(decoded.email);
  } else {
    user === undefined;
  }

  if (user === undefined && idUser === undefined) {
    return {
      props: {
        category: null,
        arrayCity: typeArrayFilter,
      },
    };
  } else if (user === "patient") {
    idUser = await userIdPatient(decoded.email);

    return {
      props: {
        category: "patient",
        idPatient: idUser?.toString(),
        arrayCity: typeArrayFilter,
      },
    };
  } else {
    return {
      props: {
        category: user,
        userId: idUser?.toString(),
        arrayCity: typeArrayFilter,
      },
    };
  }
};

export default function Home(props: any) {
  const [arrayFutureRDV, setarrayFutureRDV] = useState([]);
  const [arrayPreviousRDV, setarrayPreviousRDV] = useState([]);
  const [arrayFavoris, setarrayFavoris] = useState([]);
  const [profile, setProfile] = useState(props.category);

  const arrayCities = props.arrayCity.split(",");

  async function GetRDVPatient() {
    const dataFuture = await fetch(`/api/getFutureRDV?data=${props.idPatient}`)
      .then((result) => result.json())
      .then((response) => response.dataFuture);
    const dataPast = await fetch(`/api/getFutureRDV?data=${props.idPatient}`)
      .then((result) => result.json())
      .then((response) => response.dataPast);
    setarrayFutureRDV(dataFuture);
    setarrayPreviousRDV(dataPast);
  }
  async function GetFavorite() {
    const dataFavorite = await fetch(`/api/getFavorite?data=${props.idPatient}`)
      .then((result) => result.json())
      .then((response) => response.data);
    setarrayFavoris(dataFavorite);
  }

  useEffect(() => {
    if (profile === "patient") {
      GetRDVPatient();
      GetFavorite();
    }
  }, []);

  if (profile === null) {
    return (
      <Layout>
        <Head>
          <title>Make an appointment with Doctolib</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="page-container-welcome">
          <h1 className={styles.title}>
            Book a physical consultation with a health professional
          </h1>
          <div className="container" style={{ textAlign: "center" }}>
            <form className="form-group" action="/doctors">
              <label>
                <input
                  className={styles.inputtext}
                  type="text"
                  name="name"
                  placeholder="Find a doctor"
                />
                <select className={styles.inputtext} name="city" id="city">
                  <option value="">--Please choose a city--</option>
                  {arrayCities.map((element: any) => {
                    return (
                      <option value={element} key={element}>
                        {element}{" "}
                      </option>
                    );
                  })}
                </select>
              </label>
              <input
                className={styles.inputsubmit}
                type="submit"
                value="Submit"
              />
            </form>
            <div className={styles.gridleft}>
              <Link href="/api/auth/loginpatients">
                <a className={styles.card}>
                  <h2>Make an appointment &rarr;</h2>
                  <p>Make a quick appointment with your doctor</p>
                </a>
              </Link>
            </div>

            <div className={styles.gridright}>
              <Link href="/api/auth/login">
                <a className={styles.card}>
                  <h2>Are you a professional &rarr;</h2>
                  <p>Get connected and gain comfort and working time</p>
                </a>
              </Link>
            </div>
          </div>
        </main>
      </Layout>
    );
  } else if (profile === "medecin") {
    return (
      <Layout>
        <Head>
          <title>Make an appointment with doctolib</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <div className="container">
            <div className={styles.gridrightDoctor}>
              <Link href={`/Calendar/${props.userId}`}>
                <a className={styles.card}>
                  <h2>My Calendar</h2>
                  <p>Go to my calendar</p>
                </a>
              </Link>
            </div>
            <div className={styles.gridleftDoctorPatient}>
              <Link href={`/ListPatient/${props.userId}`}>
                <a className={styles.card}>
                  <h2>My Patients</h2>
                  <p>Go to my patients</p>
                </a>
              </Link>
            </div>
          </div>
        </main>
      </Layout>
    );
  } else if (profile === "patient") {
    return (
      <Layout>
        <main>
          <div>
            <div className="container-fluid Head">
              <h1 className={styles.title}>
                Book a physical consultation with a health professional
              </h1>
              <div className="container-fluid " style={{ textAlign: "center" }}>
                <form className="SearchBarPatient" action="/doctors">
                  <label>
                    <input
                      className={styles.inputtext}
                      type="text"
                      name="name"
                      placeholder="Find a doctor"
                    />
                  </label>
                  <input
                    className={styles.inputsubmit}
                    type="submit"
                    value="Submit"
                  />
                </form>
              </div>
            </div>

            <div className="container">
              <div className="row blocRDV">
                <div className="row titleBlockRDV"> My RDV</div>
                <div className="row">
                  <div className="col-4 colRDV">
                    {" "}
                    MY Past RDV
                    <ul className="list-group">
                      {arrayPreviousRDV.map((element: any) => {
                        return (
                          <li className="list-group-item" key={element.id}>
                            Date : {element.date} , Heure : {element.heure}
                            <> X </>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="col-4 colRDV">
                    {" "}
                    MY Coming RDV
                    <ul className="list-group">
                      {arrayFutureRDV.map((element: any) => {
                        return (
                          <li className="list-group-item" key={element.id}>
                            Date : {element.date} , Heure : {element.heure}
                            <span className="material-icons iconeDelete">
                              <Link
                                href={`/api/deleteDisponibility?data=${JSON.stringify(
                                  [element.id]
                                )}`}
                              >
                                <a>delete </a>
                              </Link>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="col-4 colRDV">
                    My Favorites Doctors
                    <ul className="list-group">
                      {arrayFavoris.map((element: any) => {
                        return (
                          <Link
                            key={element.id}
                            href={`/doctors/details?id=${element._id}`}
                          >
                            <a>
                              <li className="list-group-item">
                                {element.lastName} {element.firstName}
                                <> X </>
                              </li>
                            </a>
                          </Link>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    );
  }
}
