// middleware/cleanBodyMiddleware.js
import { cleanBody } from "../utils/cleanBody.js";

const cleanBodyMiddleware = (req, res, next) => {
  if (req.body) {
    req.body = cleanBody(req.body);
  }
  next();
};

export default cleanBodyMiddleware;