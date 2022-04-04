import { GetServerSideProps } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export const Layout: React.FC = ({ children }) => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link href="/">Logo Homepage</Link>


        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">

            <li className="nav-item" >
              <Link href="/login">
                <a className="nav-link active"> Login</a>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div>{children}</div>

    </div>
  );
};
