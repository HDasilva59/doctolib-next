import { GetServerSideProps } from "next";
import Link from "next/link";
import { getDatabase } from "../../src/database";
import { StopPage } from "../../component/404";
import { Layout } from "../../component/layout";
import { Button, Card } from "react-bootstrap";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const mongodb = await getDatabase();
  const arrayMedecins = await mongodb
    .db()
    .collection("medecin")
    .find({ speciality: context.query.speciality, city: context?.query.city })
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
            <Button variant="dark">Back</Button>
          </a>
        </Link>
        <div className="container">
          <div className="list-group">
            {data.map((element: any) => {
              return (
                <Card key={element._id}>
                  <Card.Header as="h5">
                    Dr {element.lastName} {element.firstName}
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>{element.speciality}</Card.Title>
                    <Card.Text>
                      {element.city} , {element.tarif} € / hours
                    </Card.Text>
                    <Button variant="primary">
                      <Link href={`/doctors/details?id=${element._id}`}>
                        <a>More Infos</a>
                      </Link>
                    </Button>
                  </Card.Body>
                </Card>
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
