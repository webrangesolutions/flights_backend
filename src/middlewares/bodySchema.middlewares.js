import createError from "http-errors";

export function bodyValidator(schema) {
  return async (req, res, next) => {
    try {
      const value = await schema
        .options({ stripUnknown: true })
        .validateAsync(req.body);
      req.body = value; //Unknown Values will be striped and values will be converted as well
      next();
    } catch (err) {
      let error = new createError.BadRequest(err.message);
      next(error);
    }
  };
}
