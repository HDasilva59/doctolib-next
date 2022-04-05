import { ObjectID } from "bson";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { StopPage } from "../../../component/404";
import { Layout } from "../../../component/layout";
import { getDatabase } from "../../../src/database";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const idMedecin = context.query.id;
  const mongodb = await getDatabase();
  console.log(idMedecin)
  const medecinDetails = await mongodb
    .db()
    .collection("medecin")
    .findOne({ _id: new ObjectID(`${idMedecin}`)})
    .then((result) => result);
  return {
    props: {
      patient: JSON.stringify(medecinDetails),
      lastpage: context.req.headers.referer,
    },
  };
};

export default function DetailsPatient(props: any) {
  if (props.patient !== null) {
    const data = JSON.parse(props.patient);
    return (
      <Layout>
        <Link href={`${props.lastpage}`}>
          <a>
            <button> Get back</button>
          </a>
        </Link>
        <div className="container">
          <p>Last Name : {data.lastName}</p>
          <p>First Name : {data.firstName}</p>
          <p>Email : {data.email}</p>
          <p>Phone : {data.phone}</p>
          <p>City : {data.city}</p>
          <h3>Disponibility :</h3>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
              </tr>
            </thead>
            <tbody>
              {data.disponibility.map((element: any, index: number) => {
                if (element.reserved === false) {
                  return (
                    <tr key={element._id}>
                      <th scope="row">{index + 1}</th>
                      <td>{element.date}</td>
                      <td>{element.heure}</td>
                      <td>
                        <Link
                          href={`/doctors/details/reservation/${element._id}`}
                        >
                          <a>Reserve</a>
                        </Link>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </Layout>
    );
  } else if (props.errorCode) {
    return <StopPage />;
  }
}
