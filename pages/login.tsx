import Link from "next/link";
import { Layout } from "../component/layout";
import styles from "../styles/Home.module.css";

export default function Login(props: { props: any }) {
  return (
    <Layout>
      <div className={styles.pagecontainerwelcome}>
        <div className={styles.itemcenter}>
          <main className="m-auto">
            <h1 className={styles.title}  >Login</h1>
            <div className="btn-group" role="group" aria-label="Basic example">
              <Link href="/api/auth/login">
                <a>
                  <button
                    type="button"
                    className="btn btn-secondary btn-lg btn-block"
                  >
                    Connexion Pro
                  </button>
                </a>
              </Link>
              <Link href="/api/auth/loginpatients">
                <a>
                  <button
                    type="button"
                    className="btn btn-secondary btn-lg btn-block"
                  >
                    Connexion Patient
                  </button>
                </a>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}
