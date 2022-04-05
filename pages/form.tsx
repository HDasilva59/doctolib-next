import { GetServerSideProps } from "next";

export default function Form(props: { props: any }) {
  return (
      <div>
        <form action="/api/addMedecin" method="post">
          <label>First name:</label>
          <input type="text" id="first" name="first" />
          <label>Last name:</label>
          <input type="text" id="last" name="last" />
          <label>Email:</label>
          <input type="text" id="email" name="email" />
          <label>Phone:</label>
          <input type="text" id="phone" name="phone" />
          <label>Spécialité:</label>
          <input type="text" id="spe" name="spe" />
          <label>Ville:</label>
          <input type="text" id="ville" name="ville" />
          <label>Tarif/Heure:</label>
          <input type="text" id="tarif" name="tarif" />
          <button type="submit">Submit</button>
        </form>
      </div>
  )
}




