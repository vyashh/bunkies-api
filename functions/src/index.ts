/* eslint-disable */

import * as functions from "firebase-functions";
import * as cors from "cors";
import * as express from "express";
import { getChores, getHouse, getMembers } from "./houseController";
import { createSchedule, getSchedule, test } from "./scheduleController";

const app = express();

app.use(cors({ origin: true }));

app.get("/", (req, res) => res.status(200).send("Hey there!"));
app.get("/house/:houseId", getHouse);
app.get("/house/:houseId/members", getMembers);
app.get("/house/:houseId/chores", getChores);
app.post("/house/:houseId/schedule/create", createSchedule);
app.get("/house/:houseId/schedule", getSchedule);
app.get("/test", test);

exports.app = functions.https.onRequest(app);
