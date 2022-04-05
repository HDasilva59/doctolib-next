import { GetServerSideProps } from "next";
import Link from "next/link";
import { getDatabase } from "../../src/database";
import { StopPage } from "../../component/404";
import { Layout } from "../../component/layout";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const mongodb = await getDatabase();
  const arrayMedecins = await mongodb
    .db()
    .collection("medecin")
    .find({ speciality: context.query.name })
    .toArray();
  const arrayMedecinsString = JSON.stringify(arrayMedecins);
  return {
    props: {
      medecin: arrayMedecinsString,
    },
  };
};

export default function Login(props: any) {
  if (props.patient !== null) {
    const data = JSON.parse(props.medecin);
    return (
      <Layout>
        <Link href="/">
          <a>
            <button>Back</button>
          </a>
        </Link>
        <div className="container">
          <div className="list-group">
            {data.map((element: any) => {
              return (
                <Link
                  key={element._id}
                  href={`/doctors/details?id=${element._id}`}
                >
                  <a className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{element.lastName} {element.firstName}</h5>
                    <small>{element.city}</small>
                  </div>
                  <p className="mb-1">{element.email}</p>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </Layout>
    );
  } else if (props.errorCode) {
    return <StopPage />;
  }
}
