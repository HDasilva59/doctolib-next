import { request } from "http";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Layout } from "../component/layout";
import { userCategory, userId, userIdPatient } from "../src/userInfos";
import styles from "../styles/Home.module.css";
import jwt_decode from "jwt-decode";
import { getDatabase } from "../src/database";
import moment from "moment";

export const getServerSideProps: GetServerSideProps = async (context) => {
  let user;
  let idUser;
  let decoded: any;

  const accessTokken = context.req.cookies.idTokken;

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
      },
    };
  } else if (user === "patient") {
    idUser = await userIdPatient(decoded.email);
    return {
      props: {
        category: "patient",
        idPatient: idUser?.toString(),
      },
    };
  } else {
    return {
      props: {
        category: user,
        userId: idUser?.toString(),
      },
    };
  }
};

export default function Home(props: any) {
  const [arrayFutureRDV, setarrayFutureRDV] = useState([]);
  const [arrayPreviousRDV, setarrayPreviousRDV] = useState([]);
  const [arrayFavoris, setarrayFavoris] = useState([]);
  const [profile, setProfile] = useState(props.category);

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
          <title>Prenez un rendez-vous chez Doctolib</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="page-container-welcome">
          <h1 className={styles.title}>
            Réservez une consultation physique chez un professionnel de santé
          </h1>
          <div className="container" style={{ textAlign: "center" }}>
            <form action="/doctors">
              <label>
                <input
                  className={styles.inputtext}
                  type="text"
                  name="name"
                  placeholder="Rechercher un médecin"
                />
              </label>
              <input
                className={styles.inputsubmit}
                type="submit"
                value="Submit"
              />
            </form>
            <div className={styles.gridleft}>
              <Link href="#">
                <a className={styles.card}>
                  <h2>Prenez un RDV &rarr;</h2>
                  <p>prenez un rdv rapide avec votre médecin</p>
                </a>
              </Link>
            </div>

            <div className={styles.gridright}>
              <Link href="/api/auth/login">
                <a className={styles.card}>
                  <h2>Êtes vous un pro &rarr;</h2>
                  <p>
                    Connectez-vous et gagnez en confort et en temps de travail
                  </p>
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
          <title>Prenez un rendez-vous chez doctolib</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <div className="container">
            <Link href={`/ListPatient/${props.userId}`}>
              <a>
                <button>List of Patients</button>
              </a>
            </Link>
            <Link href={`/Calendar/${props.userId}`}>
              <a>
                <button>Calendar</button>
              </a>
            </Link>
          </div>
        </main>
      </Layout>
    );
  } else if (profile === "patient") {
    return (
      <Layout>
        <main >
          <div >
            <div className='container-fluid Head'>
          <h1 className={styles.title}>
            Réservez une consultation physique chez un professionnel de santé
          </h1>
          <div className="container-fluid " style={{ textAlign: "center" }}>
            <form className='SearchBarPatient' action="/doctors">
              <label>
                <input
                  className={styles.inputtext}
                  type="text"
                  name="name"
                  placeholder="Rechercher un médecin"
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
   <div className='row blocRDV'>
     <div className='row titleBlockRDV'> My RDV</div>
<div className='row'>
                <div className='col-4 colRDV'  > MY past RDV

                <ul className="list-group">
            {arrayPreviousRDV.map((element:any) => {
              return (<li className="list-group-item" key={element.id}>Date : {element.date} , Heure : {element.heure}</li>)
            })}
                  </ul>
                </div>
     <div className='col-4 colRDV' > MY coming RDV
          <ul className="list-group">
            {arrayFutureRDV.map((element:any) => {
              return (<li className="list-group-item" key={element.id}>Date : {element.date} , Heure : {element.heure}</li>)
            })}
          </ul>
     </div>
                <div className='col-4 colRDV' >
                  My Favorites doctors
                  <ul className="list-group">
                    {arrayFutureRDV.map((element: any) => {
                      return (
                        <li className="list-group-item" key={element.id}>
                          Date : {element.date} , Heure : {element.heure}
                        </li>
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
