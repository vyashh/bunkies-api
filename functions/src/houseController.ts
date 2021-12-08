/* eslint-disable */
import { Response } from "express";
import { admin, db } from "./config/firebase";

type EntryType = {
  houseId: string;
};

type Request = {
  body: EntryType;
  params: { houseId: string };
};

const getHouse = async (req: Request, res: Response) => {
  const {
    params: { houseId },
  } = req;

  try {
    const query = db.collection("house").doc(houseId);
    const houseData = (await query.get()).data() || {};

    return res.status(200).json({
      status: "success",
      data: houseData,
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

// get info about the members of the house
const getMembers = async (req: Request, res: Response) => {
  const {
    params: { houseId },
  } = req;

  try {
    const query = db.collection("house").doc(houseId);
    const members = (await query.get()).data()!.members || {};
    let membersData: Array<any> = [];

    await db
      .collection("users")
      .where(admin.firestore.FieldPath.documentId(), "in", members)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => membersData.push(doc.data()));
      });

    return res.status(200).json({
      status: "success",
      data: membersData,
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

const getChores = async (req: Request, res: Response) => {
  const {
    params: { houseId },
  } = req;

  try {
    const query = db.collection("house").doc(houseId).collection("chores");
    const choresData: Array<any> = [];

    await query.get().then((snapshot) => {
      snapshot.forEach((doc) => choresData.push(doc.data()));
    });

    return res.status(200).json({
      status: "success",
      data: choresData,
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

export { getHouse, getMembers, getChores };
