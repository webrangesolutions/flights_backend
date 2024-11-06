// controllers/flightController.js
import flightService from "../services/flight/flight.service.js";

const flightController = {
  async createOfferRequest(req, res) {
    const { data } = req.body;
    const flightsData = await flightService.createOfferRequest(data);

    return res.status(200).json({
      message: "flight Filter Request with Id",
      data: { ...flightsData },
    });
  },

  async getOffers(req, res) {
    const { data } = req.body;
    const queryParams = req.query;

    const offers = await flightService.getOffersList(data, queryParams);

    return res.status(200).json({
      message: "list of offers",
      data: { ...offers },
    });
  },
};

export default flightController;
