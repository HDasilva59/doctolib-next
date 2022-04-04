import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Layout } from '../components/layout'
import Link from "next/link";

const Home: NextPage = () => {
  const submitSearchDoctor = (event : any) => {
    event.preventDefault();

  }
  return (
<Layout>
    <div className={styles.container}>
      <Head>
        <title>Prenez un rendez-vous chez doctolib</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Réservez une consultation physique chez un professionnel de santé
        </h1>

        <p className={styles.description}>
        <form action="/Doctors">
  <label>
    <input type="text" name="name" placeholder = "Rechercher un médecin" />
  </label>
  <input type="submit" value="Submit" />
</form>
        </p>

        <div className={styles.grid}>
          <Link href="#">
          <a  className={styles.card}>
            <h2>Prenez un RDV &rarr;</h2>
            <p>prenez un rdv rapide avec votre médecin</p>
          </a>
          </Link>




        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
    </Layout>
  )
}

export default Home

