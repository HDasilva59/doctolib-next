import { GetServerSideProps } from "next";

export default function FormPatient(props: { props: any }) {
  return (
      <div>
        <form action="/api/addPatient" method="post">
          <label>First name:</label>
          <input type="text" id="first" name="first" />
          <label>Last name:</label>
          <input type="text" id="last" name="last" />
          <label>Email:</label>
          <input type="text" id="email" name="email" />
          <label>Phone:</label>
          <input type="text" id="phone" name="phone" />
          <label>Ville:</label>
          <input type="text" id="ville" name="ville" />
          <button type="submit">Submit</button>
        </form>
      </div>
  )
}




