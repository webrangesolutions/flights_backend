// routes/flightRoutes.js
import { Router } from "express";
import { errorHandler } from "../handlers/error.handlers.js";
import flightController from "../controllers/flight.controller.js";

const flightRouter = Router();

flightRouter.post(
  "/createOfferRequest",
  errorHandler(flightController.createOfferRequest)
);

flightRouter.post("/list", errorHandler(flightController.getOffers));

export default flightRouter;
