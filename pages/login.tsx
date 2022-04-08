import { url } from "inspector";
import Link from "next/link";
import { Layout } from "../component/layout";
import styles from "../styles/Home.module.css";

export default function Login(props: { props: any }) {
  return (
    <Layout>

          <main className="m-auto">
            <h1 className={styles.title}  >Login</h1>
            <div className="row">

              <div className="col " style={{ backgroundImage: "images/backgrounddoctor1.png" ,backgroundSize: "contain", height:500, paddingTop: 50 ,borderRadius: 20,marginLeft: "1%"}}>
              <Link href="/api/auth/login">
                <a className={styles.card}  style={{ marginLeft: 250 }}>
                    Connexion Pro &rarr;
                </a>
              </Link>
              </div>
              <div className="col " style={{ backgroundColor: "blue" , backgroundSize: "contain", height:500, paddingTop: 50 ,borderRadius: 20,marginRight: "1%"}}>
              <Link href="/api/auth/loginpatients">
                <a className={styles.card} style={{ textAlign: "right",marginLeft: 250}}>
                    Connexion Patient &rarr;
                </a>
              </Link>
              </div>
            </div>

          </main>

    </Layout>
  );
}
