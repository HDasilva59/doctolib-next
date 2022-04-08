import Link from "next/link";
import { useEffect, useState } from "react";
import { Container, Dropdown, Nav, Navbar, NavDropdown } from "react-bootstrap";
import Image from "next/image";

export const Layout: React.FC = ({ children }) => {
  const [connexion, setConnexion] = useState("false");
  const [infoUser, setInfoUser] = useState("");

   async function getConnexion() {
     const connnectedResponse = await fetch("/api/isConnected").then((response) => response.json());
     const response = await fetch("/api/getInfoUser").then((response) => response.json());
     setConnexion(connnectedResponse.toString());
     if (connnectedResponse.toString() === "true") {
        setInfoUser(`${response?.lastName} ${response?.firstName}`);
     }

    }
  useEffect(() => {
    getConnexion();

  }, [])

  return (
    <>
      <Navbar bg="primary" expand="lg">
        <Container>
          <Navbar.Brand href="/" ><Image src="/images/DocoLogo.webp" alt="" width= "50" height="50"  ></Image>
 </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
            <Navbar.Text>
        {connexion === "false" ?  <Nav.Link href="/login">Login</Nav.Link>: <NavDropdown  title={`${infoUser}`} id="basic-nav-dropdown">
                <NavDropdown.Item href="/myProfile">My Profile</NavDropdown.Item>
                <NavDropdown.Item href="/api/auth/logout">Logout</NavDropdown.Item>
              </NavDropdown>}
      </Navbar.Text>
          </Navbar.Collapse>
        </Container>
    </Navbar>
      {children}
    </>
  );
};
