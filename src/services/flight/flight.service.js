// services/flightService.js
import axiosInstance from "../../config/axiosConfig.js";
import { LIMIT } from "../../libs/constants.js";

const flightService = {
  async createOfferRequest(offerData) {
    const requestData = { data: offerData };
    const response = await axiosInstance.post(
      "/air/offer_requests?return_offers=false",
      requestData
    );

    const requestId = response?.data?.data?.id;

    return requestId
      ? await this.fetchOffers({ id: requestId, limit: LIMIT })
      : null;
  },

  async getOffersList(offerData, queryParams = {}) {
    return this.fetchOffers(queryParams);
  },

  async fetchOffers(queryParams = {}) {
    const { id, limit = LIMIT, before = "", after = "" } = queryParams;
    const response = await axiosInstance.get(
      `/air/offers?offer_request_id=${id}&limit=${limit}&before=${before}&after=${after}`
    );

    return { id, ...response.data };
  },
};

export default flightService;
