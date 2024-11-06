import express from "express";
import {
  assignHTTPError,
  errorResponder,
  invalidPathHandler,
} from "../middlewares/error.middlewares.js";
import flightRouter from "./flight.routes.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Fligth Server");
});

router.use("/flights", flightRouter);

router.use(assignHTTPError);
router.use(errorResponder);
router.use(invalidPathHandler);

export default router;
