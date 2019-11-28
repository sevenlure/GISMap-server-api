import restify from "restify";
import corsMiddleware from "restify-cors-middleware";
import * as _ from "lodash";
import console from "chalk-console";
import validator from 'restify-joi-middleware'
import errors from "restify-errors";

import {
  PORT
} from "./configSys";
import configRoute from "~routes/configRoute";
import loggerMiddleware from './loggerMiddleware'

require( 'console-group' ).install();

var server = restify.createServer({
  name: "category api",
  version: "2.0.0",
  formatters: {
    "application/json": function(req, res, payload) {
      // in formatters, body is the object passed to res.send()
      // NOTE  read: https://github.com/restify/errors/pull/87
      if (payload instanceof Error) {
        const error = payload.body;
        // console.log("error", payload);
        return JSON.stringify({
          code: error.code,
          name: payload.name || 'Unknow',
          message: error.message,
          ...payload.context
        });
      }
      // for everything else, stringify as normal
      return JSON.stringify(payload);
    }
  }
});


// MARK  global vairables
global._ = _;
global.isDev = process.env.NODE_ENV !== "production";

/* MARK  Middleware  */
server.use(loggerMiddleware)
const cors = corsMiddleware({
  origins: ["http://127.0.0.1", "*"], // defaults to ['*']
  methods: ["GET", "PUT", "PATCH", "DELETE", "POST", "OPTIONS"],
  preflightMaxAge: 5, //Optional
  allowHeaders: ["Authorization"]
  // exposeHeaders: ["API-Token-Expiry"]
});
server.pre(cors.preflight);
server.pre(restify.plugins.pre.dedupeSlashes());
server.pre(restify.plugins.pre.sanitizePath());
server.use(cors.actual);
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.jsonp());
server.use(restify.plugins.gzipResponse());
server.use(restify.plugins.bodyParser());
server.use(validator({
  joiOptions: {
    convert: true,
    allowUnknown: true,
    abortEarly: false
    // .. all additional joi options
  },
  // changes the request keys validated
  // keysToValidate: ['params', 'body', 'query', 'user', 'headers', 'trailers', 'files'],

  // changes how joi errors are transformed to be returned - no error details are returned 
  // in this case
  errorTransformer: (validationInput, joiError) => {
    const tranformError = joiError.details.map(err => {
      const path = err.path.join('.')
      let item = {}
      item.type = err.type
      item.message = `${path} ${err.message}`
      return item
    })
    return new errors.InvalidArgumentError({
      name: "RouteValidation",
      info: {
        errors: tranformError
      }
    }, "Validate route fail")
  },
}))



server.listen(PORT, () => {
  console.blue(`Server is listening on port ${PORT}`);

  server.get("/", (req, res) => {
    
    res.json({
      msg: "Category API"
    });
  });

  // MARK  routes
  configRoute(server);
});
