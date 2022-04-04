import { ObjectID } from "bson";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { getDatabase } from "../../src/database";

export const getServerSideProps: GetServerSideProps = async (context) =>{
  // const category = await mongodb.db().collection("users").findOne({_id: new ObjectID(`${}`)})
  const idMedecin = context?.params?.index
  const mongodb = await getDatabase();
  const arrayPatients = await mongodb.db().collection("medecin").findOne({_id: new ObjectID(`${idMedecin}`)})
  .then((result) => result?.patients)

  const patientDetails = await Promise.all(
    arrayPatients.map(async (element: any) => {
      return await mongodb.db().collection("patient").findOne({_id: element})
    })
  );
  const arrayPatientsString = JSON.stringify(patientDetails)


  return {
    props: {
      patient: arrayPatientsString
    }
  };
}

export default function Login(props: any) {
  const dataPatients = JSON.parse(props.patient)
  return (
      <div>
        <ul>
          {dataPatients.map((element: any) => {
            return (
              <Link key={element._id} href={`/ListPatients/details/${element._id}`}>
                <a><li >Last Name: {element.lastName}, First Name: {element.firstName}</li></a>
              </Link>
            )
          })}
        </ul>
      </div>
  )
}
