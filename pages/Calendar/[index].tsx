import { ObjectID } from "bson";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { getDatabase } from "../../src/database";
import cookie from "cookie";
import { userCategory } from "../../src/userInfos";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { StopPage } from "../../component/404";
import { Layout } from "../../component/layout";
import { DisponibilityForm } from "../../component/DisponibilityForm";

export const getServerSideProps: GetServerSideProps = async (context) => {
const accessTokken = context.req.cookies.idTokken;
  let user;
  if (context.req.cookies.idTokken === undefined) {
    user = null
  }
  else {
    const decoded: any = jwt_decode(accessTokken);
   user =  await userCategory(decoded.email)
 }

  if (user === "medecin") {

  const idMedecin = context?.params?.index
  const mongodb = await getDatabase();
  const planningMedecin = await mongodb.db().collection("medecin").findOne({ _id: new ObjectID(`${idMedecin}`) })
    .then((result) => result?.disponibility)

    let data;
    if (planningMedecin === undefined) {
      data = [];
    } else {
      data = planningMedecin;
    }

    return {
    props: {
      planning: data,
      errorCode:"nothing"
    }
  };
  } else {
     return {
    props: {
        patient: null,
        errorCode: "error"
    }
  };
  }
}

export default function Calendar(props: any) {
  const [afficheForm, setAfficheForm] = useState(<></>)
  const [arrayDelete,setArrayDelete] = useState<string[]>([]);

  function changeArraySelection(event: any) {
    if (event.target.checked === true) {
      setArrayDelete(arrayDelete => [...arrayDelete, event.target.value]);
    } else {
      const index = arrayDelete.indexOf(event.target.value);
      if (index !== -1) {
        arrayDelete.splice(index, 1);
      }
    }
  }

  if (props.errorCode === "nothing") {
    if (props.planning.length === 0) {
      return (
        <Layout>
          <h1>Nothing Date</h1>
            <button onClick={() => setAfficheForm(<DisponibilityForm/>)}>Add disponibility</button>
          {afficheForm}
        </Layout>
      )
    } else {
      return (<Layout>
                <div className="container">
                    <div className="form-check">
                        <ul className="list-group">
                          {props.planning.map((element: any) => {
                            return (
                                <div key={element._id}>
                                  <input  onClick={(event) => changeArraySelection(event)} className="form-check-input" type="checkbox" value={element._id} id={element._id}/>
                                  <li    className="list-group-item">Date: {element.date}, Heure: {element.heure}</li>
                                </div>
                            )
                          })}
                        </ul>
                    </div>
                    <button onClick={() => setAfficheForm(<DisponibilityForm />)}>Add disponibility</button>
                    {arrayDelete.length !== 0 ? <Link href={`/api/deleteDisponibility?data=${JSON.stringify(arrayDelete)}`}><a><button>Delete selection</button></a></Link> : <></>}

                    {afficheForm}
                  </div>
              </Layout>)
    }

  } else if (props.errorCode === "error") {
    return <StopPage />
  }
}
