import restify from "restify";
import errors from "restify-errors";
import { Router } from "restify-router";
import moment from "moment";
import Joi from "joi";

import { _keyArr as KEY_GENERAL_LAYERS } from "~constants/layer/general";

import Layer_HanhChinh_ProvinceModel from "~models/Layer/Layer_HanhChinh_ProvinceModel";
import Layer_HanhChinh_DistrictModel from "~models/Layer/Layer_HanhChinh_DistrictModel";
import Layer_HanhChinh_WardModel from "~models/Layer/Layer_HanhChinh_WardModel";
import Layer_Marker_GeneralModel from "~models/Layer/Layer_Marker_GeneralModel";
import Layer_Marker_OwnModel from "~models/Layer/Layer_Marker_OwnModel";

const KEY_CACHE = {
  getAllHanhChinh: "getAllHanhChinh"
};
const _layerRoute = new Router();

// init

_layerRoute.get("/getAllHanhChinh", async (req, res, next) => {
  try {
    let payload = global._cache.get(KEY_CACHE.getAllHanhChinh);
    if (payload == undefined) {
      payload = {
        province: await Layer_HanhChinh_ProvinceModel.find({}),
        district: await Layer_HanhChinh_DistrictModel.find({}),
        ward: await Layer_HanhChinh_WardModel.find({})
      };
      global._cache.set(KEY_CACHE.getAllHanhChinh, payload);
    }
    res.json(payload);
    next();
  } catch (e) {
    next(e);
  }
});

/* #region  marker-general */

_layerRoute.get(
  {
    path: "/marker-general/countAll"
  },
  async (req, res, next) => {
    try {
      const key_cache = `/marker-general/countAll`;

      let payload = global._cache.get(key_cache);
      if (payload == undefined) {
        payload = {
          "GENERAL/UNCATEGORIZED_MARKERS": await Layer_Marker_GeneralModel.find(
            {
              "properties.Key": "GENERAL/UNCATEGORIZED_MARKERS"
            }
          ).countDocuments()
        };
        global._cache.set(key_cache, payload);
      }
      res.json(payload);

      next();
    } catch (e) {
      next(e);
    }
  }
);

_layerRoute.get(
  {
    path: "/marker-general",
    validation: {
      // prettier-ignore
      schema: {
      query: Joi.object().keys({
        key: Joi.string().required().valid([
          ...KEY_GENERAL_LAYERS
        ]),
        idsHanhChinh: Joi.array().items(Joi.string())
      }).required()
    }
    }
  },
  async (req, res, next) => {
    try {
      const { key, idsHanhChinh = [] } = req.query;
      // const key_cache = `/marker-general/getall_${key}`;

      let payload = await Layer_Marker_GeneralModel.find({
        "properties.Key": key,
        $or: [
          { "properties.MaTP": { $in: idsHanhChinh } },
          { "properties.MaQH": { $in: idsHanhChinh } },
          { "properties.MaPX": { $in: idsHanhChinh } }
        ]
      });

      res.json(payload);

      next();
    } catch (e) {
      next(e);
    }
  }
);
/* #endregion */

/* #region  marker-own */

_layerRoute.get(
  {
    path: "/marker-own/countAll"
  },
  async (req, res, next) => {
    try {
      const key_cache = `/marker-own/countAll`;

      let payload = global._cache.get(key_cache);
      if (payload == undefined) {
        payload = {
          "OWN/MY_STORES": await Layer_Marker_OwnModel.find({
            "properties.Key": "OWN/MY_STORES"
          }).countDocuments()
        };
        global._cache.set(key_cache, payload);
      }
      res.json(payload);

      next();
    } catch (e) {
      next(e);
    }
  }
);

_layerRoute.get(
  {
    path: "/marker-own",
    validation: {
      // prettier-ignore
      schema: {
      query: Joi.object().keys({
        key: Joi.string().required().valid([
          "OWN/MY_STORES"
        ])
      }).required()
    }
    }
  },
  async (req, res, next) => {
    try {
      const { key } = req.query;
      const key_cache = `/marker-own/getall_${key}`;

      let payload = global._cache.get(key_cache);
      if (payload == undefined) {
        payload = await Layer_Marker_OwnModel.find({
          "properties.Key": key
        });
        global._cache.set(key_cache, payload);
      }
      res.json(payload);

      next();
    } catch (e) {
      next(e);
    }
  }
);
/* #endregion */
export default _layerRoute;
