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
        <div className="container-fluid divCalendarRDV">
          <div className="row">
            <div className="col">
                    <div className="form-check">
                        <ul className="list-group">
                  {props.planning.map((element: any) => {
                    if (element.reserved === true) {
                      return (
                        <div key={element._id}>
                          <input onClick={(event) => changeArraySelection(event)} className="form-check-input" type="checkbox" value={element._id} id={element._id} />
                          <Link href={`/Calendar/Information/${element._id}`}><a><li className="list-group-item-success">Date: {element.date}, Heure: {element.heure}  RESERVED</li></a></Link>
                        </div>
                      )
                    }
                          })}
                        </ul>
                    </div>
            </div>
            <div className="col">
                    <div className="form-check">
                        <ul className="list-group">
                          {props.planning.map((element: any) => {
                    if (element.reserved === false) {
                      return (
                        <div key={element._id}>
                          <input onClick={(event) => changeArraySelection(event)} className="form-check-input" type="checkbox" value={element._id} id={element._id} />
                          <li  className="list-group-item-warning">Date: {element.date}, Heure: {element.heure} </li>
                        </div>
                      )
                    }
                          })}
                        </ul>
                  </div>
            </div>
            <div className="buttonDisponibility">
                    <button onClick={() => setAfficheForm(<DisponibilityForm />)} type="button" className="btn btn-md btn-primary" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?">Add disponibility</button>
                    {arrayDelete.length !== 0 ? <Link href={`/api/deleteDisponibility?data=${JSON.stringify(arrayDelete)}`}><a><button type="button" className="btn btn-md btn-primary" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?">Delete Selection</button></a></Link> : <></>}


            </div>
            <div>
              {afficheForm}
            </div>
                </div>
              </div>
              </Layout>)
    }

  } else if (props.errorCode === "error") {
    return <StopPage />
  }
}
