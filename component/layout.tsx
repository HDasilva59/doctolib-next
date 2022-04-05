import { GetServerSideProps } from "next";
import Head from "next/head";
import styles from "./styles/Home.module.css";
import Link from "next/link";

export const Layout: React.FC = ({ children }) => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
          <Link  href="/"><a className="navbar-brand">Home</a></Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <Link href="/login">
                <a className="nav-link active">
                  <li className="nav-item">Login</li></a>
              </Link>
              <Link href="/api/auth/logout">
                <a className="nav-link active">
                  <li className="nav-item">Logout</li></a>
              </Link>
            </ul>
          </div>
        </div>
      </nav>


        {children}


    </div>
  );
};
