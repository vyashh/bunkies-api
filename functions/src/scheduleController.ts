/* eslint-disable */
import { Response } from "express";
import moment = require("moment");
import { admin, db } from "./config/firebase";

type EntryType = {
  houseId: string;
};

type Request = {
  body: EntryType;
  params: { houseId: string };
};


// set start of week on monday
moment.updateLocale('en', {
  week: {
    dow: 1,
  },
});

const createSchedule = async (req: Request, res: Response) => {
  const {
    params: { houseId },
  } = req;

  const getEveryMonday = () => {
    let currentDate: any = moment(Date.now()); // now
    var nextDate = moment(new Date(currentDate)).add("1", "year"); // 1 year from now
    var end = moment(nextDate);

    // let timeNow = ;
    var day = 0;

    var result = [];
    var current = currentDate.clone();

    while (current.day(7 + day).isSameOrBefore(end)) {
      result.push(current.clone());
    }

    return result.map((m) => m.format("DD/MM/YYYY"));
  };

  try {
    const query = db.collection("house").doc(houseId);
    const members = (await query.get()).data()!.members || {};
    let membersData: Array<any> = [];
    const schedule: Array<any> = [];
    const dates = getEveryMonday();

    await db
      .collection("users")
      .where(admin.firestore.FieldPath.documentId(), "in", members)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => membersData.push(doc.data()));
      });

    // add each date in the schedule array with a member.
    let count = 0;
    for (let i = 0; i < dates.length; i++) {
      const weekNumber = moment(dates[i], "DD/MM/YYYY").week();
      schedule.push({
        user_id: membersData[count].user_id,
        name: membersData[count].first_name,
        date: dates[i],
        week: weekNumber,
      });

      // keep the member loop running
      count++;
      if (count === members.length) {
        count = 0;
      }
    }

    // send to firestore
    await db.collection("house").doc(houseId).set(
      {
        schedule: schedule,
      },
      { merge: true }
    );

    return res.status(200).json({
      status: "success",
      data: schedule,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json(error.message);
    }
    return res
      .status(500)
      .json({ message: "Something went wrong. Try again." });
  }
};

const getSchedule = async (req: Request, res: Response) => {
    const {
        params: { houseId },
      } = req;
    
      try {
        const query = db.collection("house").doc(houseId);
        const houseData = (await query.get()).data() || {};
    
        return res.status(200).json({
          status: "success",
          data: houseData.schedule,
        });
      } catch (error) {
        if (error instanceof Error) {
          return res.status(500).json(error.message);
        }
        return res
          .status(500)
          .json({ message: "Something went wrong. Try again." });
      }
};

const test = async (req: Request, res: Response) => {
  
    try {
      const weekNumber = moment('12/12/2021', "DD/MM/YYYY").startOf('week').week();

  
      return res.status(200).json({
        status: "success",
        data: weekNumber,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json(error.message);
      }
      return res
        .status(500)
        .json({ message: "Something went wrong. Try again." });
    }
};


export { createSchedule, getSchedule };
