import { GetServerSideProps } from "next";
import { Layout } from "../component/layout";
import jwt_decode from "jwt-decode";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {

   const accessTokken = context.req.cookies.idTokken;
  let decoded: any= jwt_decode(accessTokken.toString());


  return {
      props: {
        email: decoded.email
      },
    };


};

export default function FormMedecin(props: any) {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event:any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <Layout>
      <div className="container">
    <Form noValidate validated={validated} action="/api/addMedecin" method="post" onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>First name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter your first name"
            id="first"
            name="first"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            required
            type="text"
           placeholder="Enter your last name"
            id="last"
            name="last"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustomUsername">
          <Form.Label>Email</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
            <Form.Control
              type="text"
              aria-describedby="inputGroupPrepend"
                  value={`${props.email}`}
                  id="email"
                  name="email"
            />
            <Form.Control.Feedback type="invalid">
              Please choose a username.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Spéciality</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter your city"
            id="spe"
            name="spe"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
             <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Price /Hour</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter your tarif"
            id="tarif"
            name="tarif"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
<Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>City</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter your city"
            id="ville"
            name="ville"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            required
            type="text"
           placeholder="Enter your phone number"
            id="phone"
            name="phone"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Button type="submit">Submit form</Button>
    </Form>
      </div>
    </Layout>
  );
}
