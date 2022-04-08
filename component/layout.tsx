import Link from "next/link";
import { useEffect, useState } from "react";
import { Container, Dropdown, Nav, Navbar, NavDropdown } from "react-bootstrap";
import Image from "next/image";
import { Height } from "@mui/icons-material";

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
          <Navbar.Brand href="/" ><Image src="/images/DocLogoBlanc.png" alt="" width= "150" height="40"  ></Image>
 </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
            <Navbar.Text>
        {connexion === "false" ?  <Nav.Link href="/login" style={{ color: "white", fontSize:25}}>Login</Nav.Link>: <NavDropdown style={{ color: "white", fontSize:25}}   title={`${infoUser}`} id="basic-nav-dropdown" >
               <NavDropdown.Item href="/myProfile" ><span className="material-icons">
account_circle
</span>My Profile </NavDropdown.Item>
                <NavDropdown.Item href="/api/auth/logout"><span className="material-icons">
logout
</span>Logout</NavDropdown.Item>
              </NavDropdown>}
      </Navbar.Text>
          </Navbar.Collapse>
        </Container>
    </Navbar>
      {children}
    </>
  );
};
