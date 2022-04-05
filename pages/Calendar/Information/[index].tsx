import { ObjectID } from "bson";
import { GetServerSideProps } from "next";
import jwt_decode from "jwt-decode";
import { userCategory } from "../../../src/userInfos";
import { getDatabase } from "../../../src/database";
import { Layout } from "../../../component/layout";
import { StopPage } from "../../../component/404";
import Link from "next/link";

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

  const idDisponibility = context?.params?.index
  const mongodb = await getDatabase();
  const infoReservation = await mongodb.db().collection("patient").findOne({
              "reservation.resa": idDisponibility,
            },)

    let data;
    if (infoReservation === undefined) {
      data = [];
    } else {
      data = infoReservation;
    }

    return {
    props: {
        data: JSON.stringify(data),
      lastURL: context.req.headers.referer,
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

  if (props.errorCode === "nothing") {
    const data = JSON.parse(props.data);
    return <Layout>
      <Link href={`${props.lastURL}`}><a ><button>Back</button></a></Link>
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
                            <i className="glyphicon glyphicon-phone"></i><a href="http://www.jquery2dotnet.com">{data.phone}</a>
                            <br />
                            <i className="glyphicon glyphicon-gift"></i></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
      <form className="container" method="POST" action={`/api/doctors/sendEmail`}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input type="email" className="form-control" id="exampleFormControlInput1" name="email" value={data.email} />
            </div>
            <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea className="form-control" id="formArea" name="formArea" ></textarea>
            <button type="submit" className="btn btn-primary mb-3">Send Email</button>
          </div>
      </form>
    </Layout>;
  } else if (props.errorCode === "error") {
    return <StopPage />
  }
}

