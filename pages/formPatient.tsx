import { GetServerSideProps } from "next";
import { Layout } from "../component/layout";

export default function FormPatient(props: { props: any }) {
  return (

    <Layout>
      <div className="container">
      <form action="/api/addPatient" method="post">
        <div className="mb-3 mt-3">
          <label  className="form-label">First Name:</label>
          <input type="text" className="form-control" id="first" placeholder="Enter your first name" name="first"/>
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name:</label>
          <input type="text" className="form-control" id="last" placeholder="Enter your last name" name="last"/>
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input type="text" className="form-control" id="email" placeholder="Enter your email" name="email"/>
        </div>
        <div className="mb-3">
          <label className="form-label">Phone number:</label>
          <input type="text" className="form-control" id="phone" placeholder="Enter your phone number" name="phone"/>
        </div>
        <div className="mb-3">
          <label className="form-label">City:</label>
          <input type="text" className="form-control" id="ville" placeholder="Enter your city" name="ville"/>
        </div>
        <div className="form-check mb-3">
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
    </Layout>

  )
}




