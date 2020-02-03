// ESM syntax is supported.
import console from "chalk-console";
import * as _ from "lodash";
import mongoose from "mongoose";
import NodeCache from "node-cache";
import restify from "restify";
import corsMiddleware from "restify-cors-middleware";
import errors from "restify-errors";
import validator from "restify-joi-middleware";

import _adminroleRoute from "~routes/adminRoute/roleRoute";
import _layerRoute from "~routes/layerRoute";
import { MONGO_OPTIONS, PORT } from "./configSys";
import loggerMiddleware from "./loggerMiddleware";

const _cache = new NodeCache({ stdTTL: 500, checkperiod: 30 });
require("console-group").install();

var server = restify.createServer({
  name: "restfull api",
  version: "0.0.1",
  formatters: {
    "application/json": function(req, res, payload) {
      // in formatters, body is the object passed to res.send() NOTE  read: https://github.com/restify/errors/pull/87
      if (payload instanceof Error) {
        const error = payload.body;
        return JSON.stringify({
          code: _.get(error, "code", "InternalServer"),
          name: payload.name || "Unknow",
          message: _.get(error, "message", payload.message),
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
global._cache = _cache;

/* MARK  Middleware  */
server.use(loggerMiddleware);
const cors = corsMiddleware({
  origins: ["http://127.0.0.1", "*"], // defaults to ['*']
  methods: ["GET", "PUT", "PATCH", "DELETE", "POST", "OPTIONS"],
  preflightMaxAge: 5, // Optional
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
server.use(
  validator({
    joiOptions: {
      convert: true,
      allowUnknown: true,
      abortEarly: false
      // .. all additional joi options
    },
    // changes the request keys validated keysToValidate: ['params', 'body', 'query', 'user', 'headers', 'trailers',
    // 'files'], changes how joi errors are transformed to be returned - no error details are returned in this case
    errorTransformer: (validationInput, joiError) => {
      const tranformError = joiError.details.map(err => {
        const path = err.path.join(".");
        let item = {};
        item.type = err.type;
        item.message = `${path} ${err.message}`;
        return item;
      });
      return new errors.InvalidArgumentError(
        {
          name: "RouteValidation",
          info: {
            errors: tranformError
          }
        },
        "Validate route fail"
      );
    }
  })
);

// MARK  connect
console.green(`Connecting to mongo ${MONGO_OPTIONS.uri}`);
mongoose
  .connect(MONGO_OPTIONS.uri, {
    // user: MONGO_OPTIONS.user,
    // pass: MONGO_OPTIONS.pass,
    ...MONGO_OPTIONS.db_options
  })
  .catch(error => console.error(error));
const db = mongoose.connection;

// MARK  Main
db.once("open", () => {
  console.yellow(`connected ${MONGO_OPTIONS.uri} succsesfull`);

  // NOTE  start
  server.listen(PORT, () => {
    console.blue(`Server is listening on port ${PORT}`);

    server.get("/", (req, res) => {
      res.json({ msg: "Resful API" });
    });

    // MARK  routes
    _adminroleRoute.applyRoutes(server, "/admin/role");
    _layerRoute.applyRoutes(server, "/layer");
  });
});
