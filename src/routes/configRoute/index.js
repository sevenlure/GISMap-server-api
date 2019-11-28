import restify from "restify";
import errors from "restify-errors";
// import moment from "moment";
import Joi from 'joi'

import configs from "~constants/configs";
import {
  ConfigTampError
} from "~constants/errorsName/config";

const PREPATH = "/config";

export default (server = restify.createServer()) => {
  server.get(PREPATH, async (req, res, next) => {
    try {
      // throw new errors.ServiceUnavailableError({
      //   name: ConfigTampError,
      //   info: {
      //     day_la_key: "bar"
      //   }
      // }, "zomg!");
      res.json(configs);
      next();
    } catch (e) {
      next(e);
    }
  });

  server.post({
    path: PREPATH,
    validation: {
      schema: Joi.object().keys({
        params: Joi.object().keys({
          id: Joi.number().min(0).required()
        }).required(),
        body: Joi.object().keys({
          id: Joi.number().min(0).required(),
          name: Joi.number().required(),
        }).required()
      })
    }
  }, async (req, res, next) => {
    try {
      throw new errors.ServiceUnavailableError({
        name: ConfigTampError,
        info: {
          day_la_key: "bar"
        }
      }, "zomg!");

      res.json(configs);
      next();
    } catch (e) {
      next(e);
    }
  });
};
