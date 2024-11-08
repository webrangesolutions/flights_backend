// services/flightService.js
import axiosInstance from "../../config/axiosConfig.js";
import { LIMIT } from "../../libs/constants.js";

const flightService = {
  offers: new Map(),
  offerTimers: new Map(),
  async createOfferRequest(offerData) {
    const requestData = { data: offerData };

    const response = await axiosInstance.post(
      "/air/offer_requests?return_offers=false",
      requestData
    );

    const requestId = response?.data?.data?.id;

    return requestId
      ? await this.fetchOffers({}, { id: requestId, limit: LIMIT, page: 1 })
      : null;
  },

  async getOffersList(offerData, queryParams = {}) {
    return this.fetchOffers(offerData, queryParams);
  },

  async getAllOffers(id) {
    let after = "";
    this.offers.set(id, []);

    this.resetOfferTimer(id);

    while (true) {
      const response = await axiosInstance.get(
        `/air/offers?offer_request_id=${id}&limit=200&after=${after}`
      );

      const { data, meta } = response.data;

      this.offers.get(id).push(...data);

      if (meta.after) {
        after = meta.after;
      } else {
        break;
      }
    }
  },

  async fetchOffers(offerData = {}, queryParams = {}) {
    const { id, limit = LIMIT, page = 1 } = queryParams;

    const pageInt = +page;
    const limitInt = +limit;

    this.resetOfferTimer(id);

    const {
      cabin_class = "",
      base_amount = [],
      stops = [],
      airlines = [],
    } = offerData;

    if (this.offers.has(id)) {
      const [minAmount, maxAmount] = base_amount;
      const pStops = stops.map((stop) => +stop);
      const pAirlines = airlines.map((airline) => airline.toLowerCase());

      let filteredOffers = this.offers.get(id)?.filter((offer) => {
        // Cabin class filter
        const cabinClassMatch =
          !cabin_class ||
          offer.slices.some((slice) =>
            slice.segments.some((segment) =>
              segment.passengers.some(
                (passenger) => passenger.cabin_class === cabin_class
              )
            )
          );

        // Base amount filter
        const baseAmountMatch =
          base_amount.length !== 2 ||
          (+offer.base_amount >= +minAmount &&
            +offer.total_amount <= +maxAmount);

        // Stops filter
        const stopsMatch =
          pStops.length === 0 ||
          offer.slices.some((slice) => {
            const segmentLength = slice.segments.length - 1;
            if (pStops.includes(0) && pStops.includes(1) && pStops.includes(2))
              return true;
            if (pStops.includes(0) && pStops.includes(1))
              return segmentLength <= 1;
            if (pStops.includes(0)) return segmentLength === 0;
            if (pStops.includes(1) && pStops.includes(2))
              return segmentLength >= 1;
            if (pStops.includes(1)) return segmentLength === 1;
            if (pStops.includes(2)) return segmentLength >= 2;
            return false;
          });

        // Airlines filter
        const airlinesMatch =
          pAirlines.length === 0 ||
          offer.slices.some((slice) =>
            slice.segments.some((segment) =>
              pAirlines.includes(segment?.operating_carrier.name?.toLowerCase())
            )
          );

        // Return combined result
        return (
          cabinClassMatch && baseAmountMatch && stopsMatch && airlinesMatch
        );
      });

      // Pagination
      const startIndex = (pageInt - 1) * limitInt;
      const paginatedData = filteredOffers.slice(
        startIndex,
        startIndex + limitInt
      );

      return {
        meta: {
          size: paginatedData.length,
          totalSize: filteredOffers.length,
          totalPages: Math.ceil(filteredOffers.length / limitInt),
          currentPage: pageInt,
          id: id,
        },
        data: paginatedData,
      };
    } else {
      await this.getAllOffers(id);
      return this.fetchOffers(offerData, { id, limit, page });
    }
  },

  clearOfferData(id) {
    this.offers.delete(id);
    this.offerTimers.delete(id);
  },

  resetOfferTimer(id) {
    if (this.offerTimers.has(id)) {
      clearTimeout(this.offerTimers.get(id));
    }

    const INACTIVITY_PERIOD = 15 * 60 * 1000;
    const timer = setTimeout(() => this.clearOfferData(id), INACTIVITY_PERIOD);

    this.offerTimers.set(id, timer);
  },
};

export default flightService;
