import { ObjectID } from "bson";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { StopPage } from "../../../component/404";
import { Layout } from "../../../component/layout";
import { getDatabase } from "../../../src/database";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const idMedecin = context.query.id;
  const mongodb = await getDatabase();
  const medecinDetails = await mongodb
    .db()
    .collection("medecin")
    .findOne({ _id: new ObjectID(`${idMedecin}`)})
    .then((result) => result);
  return {
    props: {
      patient: JSON.stringify(medecinDetails),
      speciality: `${process.env.AUTH0_BASE_URL}/doctors?name=${medecinDetails?.speciality}`,
    },
  };
};

export default function DetailsPatient(props: any) {
  const [modalOpen, setModalOpen] = useState(false);

  if (props.patient !== null) {
    const data = JSON.parse(props.patient);
    return (
      <Layout>
        <Link href={`${props.speciality}`}>
          <a>
            <button> Get back</button>
          </a>
        </Link>
        <div className="container">
          <div className="container small">
    <div className="row">
        <div className="col-xs-12 col-sm-6 col-md-6">
            <div className="well well-sm">
                <div className="row">
                    <div className="col-sm-6 col-md-4">
                        <img src="http://placehold.it/380x500" alt="" className="img-rounded img-responsive" />
                    </div>
                    <div className="col-sm-6 col-md-8">
                        <h4>{data.lastName} {data.firstName}</h4>
                        <small><cite title={`${data.firstName}`}>{data.city} <i className="glyphicon glyphicon-map-marker">
                        </i></cite></small>
                        <p>
                            <i className="glyphicon glyphicon-envelope"></i>{data.email}
                            <br />
                            <i className="glyphicon glyphicon-phone"></i>{data.phone}
                            <br />
                            <i className="glyphicon glyphicon-gift"></i></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div><br /><br /><br />
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
                           <>
      <Button
        color="primary"
        type="button"
        onClick={() => setModalOpen(!modalOpen)}
      >
        Reserve
      </Button>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className=" modal-header">
          <h5 className=" modal-title" id="exampleModalLabel">
            Validation
          </h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <ModalBody>Confirm Your Reservation.</ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            No
            </Button>
          <Link href={`/api/reservation?idDispo=${element._id}`}><a>
          <Button color="primary" type="button">
            Yes
           </Button>
           </a></Link>
        </ModalFooter>
      </Modal>
    </>
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
