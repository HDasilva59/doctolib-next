import { ObjectID } from "bson";
import { GetServerSideProps } from "next";
import jwt_decode from "jwt-decode";
import { userCategory } from "../../../../src/userInfos";
import { getDatabase } from "../../../../src/database";
import { Layout } from "../../../../component/layout";
import { StopPage } from "../../../../component/404";
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
  if (user === "patient") {
    const idDisponibility = context?.params?.index;
    const lastPage = context.req.headers.referer;

    return {
      props: {
        idDispo: idDisponibility,
        lastPage: lastPage,
      },
    };
  } else {
    return {
      props: {
        patient: null,
        errorCode: "error",
      },
    };
  }
};

export default function Reservation(props: any) {
  if (props.idDispo !== null) {
   return <Layout>
    <Link href={`/api/reservation?idDispo=${props.idDispo}`}><a><button>Confirm</button></a></Link>
     <Link href={`${props.lastPage}`}><a><button>Cancel</button></a></Link>
   </Layout>
  } else if (props.errorCode) {
    return <StopPage />
  }
}
