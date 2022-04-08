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

              <div className="col Uno " style={{  height:550, paddingTop: 50 ,borderRadius: 20,marginRight: "50px",marginLeft:"50px"}}>
              <Link href="/api/auth/login">
                <a className={styles.card}  style={{ marginLeft: 222 }}>
                    Connexion Pro &rarr;
                </a>
              </Link>
              </div>
              <div className="col Dos " style={{  height:550, paddingTop: 50 ,borderRadius: 20,marginRight: "50px",marginLeft:"50px"}}>
              <Link href="/api/auth/loginpatients" >
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
