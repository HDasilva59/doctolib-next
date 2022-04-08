import Head from "next/head";
import dynamic from "next/dynamic";
import "smart-webcomponents-react/source/styles/smart.default.css";
import styles from "../styles/Home.module.css";
import { GetServerSideProps } from "next";
import jwt_decode from "jwt-decode";
import { userCategory } from "../src/userInfos";
import { getDatabase } from "../src/database";
import { parse } from "node:path/win32";

//Dynamically import the Smart.Scheduler component
const Scheduler = dynamic(() => import("smart-webcomponents-react/scheduler"), {
  ssr: false, //no server-side rendering
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const accessTokken = context.req.cookies.idTokken;
  let user;
  if (context.req.cookies.idTokken === undefined) {
    user = null;
  } else {
    const decoded: any = jwt_decode(accessTokken);
    user = await userCategory(decoded.email);
  }


 if (user === "medecin") {
    const decoded: any = jwt_decode(accessTokken);
    user = await userCategory(decoded.email);
    const mongodb = await getDatabase();
    const dispoList = await mongodb
      .db()
      .collection("medecin")
      .findOne({ email: decoded.email })
      .then((result) => result?.disponibility);

    return {
      props: {
        user:"medecin",
        data: JSON.stringify(dispoList),
      },
    };
  } else {
    return {
      props: {
        user:null,
        patient: null,
        errorCode: "error",
      },
    };
  }
};
export default function CalendarDetails(props: any) {
  if (props.data !== undefined) {
    const ListDispo = JSON.parse(props.data);

    const data = ListDispo.map((element: any) => {

      if (element.reserved === true) {
        return {
          label: element._id,
          dateStart: new Date(element.date.split("/")[2], parseInt(element.date.split("/")[1]) - 1, element.date.split("/")[0], element.heure.split(":")[0], element.heure.split(":")[1]),
          dateEnd: new Date(element.date.split("/")[2], parseInt(element.date.split("/")[1]) - 1, element.date.split("/")[0], parseInt(element.heure.split(":")[0]) + 1, element.heure.split(":")[1]),
          backgroundColor: "#2ecc71",
        }
      } else {
        return {
          label: element._id,
          dateStart: new Date(element.date.split("/")[2], parseInt(element.date.split("/")[1]) - 1, element.date.split("/")[0], element.heure.split(":")[0], element.heure.split(":")[1]),
          dateEnd: new Date(element.date.split("/")[2], parseInt(element.date.split("/")[1]) - 1, element.date.split("/")[0], parseInt(element.heure.split(":")[0]) + 1, element.heure.split(":")[1]),
          backgroundColor: "#e67e22",
        }
      }
    })

    const today = new Date(),
      todayDate = today.getDate(),
      currentYear = today.getFullYear(),
      currentMonth = today.getMonth(),


      dataSource = data,
      currentTimeIndicator = true,
      shadeUntilCurrentTime = true,
      view = "day",
      views = [
        "day",
        "week",
        "month",
        "timelineDay",
        "timelineWeek",
        "timelineMonth",
      ],
      firstDayOfWeek = 1;

    return (
      <div>
        <Scheduler
          style={{ height: "100%" }}
          className={styles.scheduler}
          id="scheduler"
          currentTimeIndicator={currentTimeIndicator}
          shadeUntilCurrentTime={shadeUntilCurrentTime}
          dataSource={dataSource}
          view={view}
          firstDayOfWeek={firstDayOfWeek}
        ></Scheduler>
      </div>
    );
  }
}
