import { request } from 'http'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { Layout } from '../component/layout'
import { userCategory, userId } from '../src/userInfos'
import styles from '../styles/Home.module.css'
import jwt_decode from "jwt-decode";

export const getServerSideProps: GetServerSideProps = async (context) => {

  let user;
  let idUser;
  let decoded: any;

   const accessTokken = context.req.cookies.idTokken;

  if (accessTokken !== undefined) {
    decoded = jwt_decode(accessTokken.toString());
    user = await userCategory(decoded.email);
    idUser= await userId(decoded.email);
  } else {
    user === undefined
  }
  if (user === undefined || idUser === undefined) {
    return {
    props: {
      category: null,
    }
  };
  } else {
    return {
    props: {
      category: user,
      userId: idUser?.toString()
    }
  };
  }

}


export default function Home(props: any) {

  const [profile, setProfile] = useState(props.category)

   const submitSearchDoctor = (event : any) => {
    event.preventDefault();

   }

  if (profile=== null) {

    return (
      <Layout>
        <Head>
          <title>Prenez un rendez-vous chez doctolib</title>
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
                <input type="text" name="name" placeholder="Rechercher un médecin" />
              </label>
              <input type="submit" value="Submit" />
            </form>
            <div className={styles.grid}>
              <Link href="#">
                <a className={styles.card}>
                  <h2>Prenez un RDV &rarr;</h2>
                  <p>prenez un rdv rapide avec votre médecin</p>
                </a>
              </Link>
            </div>
          </div>
        </main>
      </Layout>
    )
  } else if (profile === "medecin") {
    return (
      <Layout>
        <Head>
          <title>Prenez un rendez-vous chez doctolib</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <div className='container'>
            <Link href={`/ListPatient/${props.userId}`}><a><button>List of Patients</button></a></Link>
            <Link href={`/Calendar/${props.userId}`}><a><button>Calendar</button></a></Link>
          </div>
        </main>
      </Layout>
    )
  }
};
