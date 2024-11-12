export const errorHandler = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      console.log("error: ", err.response.data);

      next(err);
    }
  };
};
