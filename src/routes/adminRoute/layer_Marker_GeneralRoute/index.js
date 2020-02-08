import restify from 'restify'
import errors from 'restify-errors'
import { Router } from 'restify-router'
import moment from 'moment'
import Joi from 'joi'
import joiObjectid from 'joi-objectid'
import NodeCache from 'node-cache'
import * as _ from 'lodash'

import Layer_Marker_GeneralModel from '~models/Layer/Layer_Marker_GeneralModel'
import authenAdminMiddleware from '~middlewares/authenAdmin'
import { getListWithPagination, getAll, getBy_id, updateBy_id, deleteBy_id } from '../base'

Joi.objectId = joiObjectid(Joi)
const _Layer_Marker_GeneralRoute = new Router()
const KEY_CACHE_FORCE_LOGOUT = 'FORCE_LOGOUT'

_Layer_Marker_GeneralRoute.use(authenAdminMiddleware)
getListWithPagination(_Layer_Marker_GeneralRoute, { path: '' }, Layer_Marker_GeneralModel)

getBy_id(_Layer_Marker_GeneralRoute, { path: `/:_id` }, Layer_Marker_GeneralModel)

/* #region  getALL */
_Layer_Marker_GeneralRoute.get(
  {
    path: `/getAll`
  },
  async (req, res, next) => {
    try {
      let data = await Layer_Marker_GeneralModel.find().sort({ CreatedAt: -1 })

      res.json(data)
      next()
    } catch (err) {
      next(err)
    }
  }
)
/* #endregion */

/* #region  updateBy_id */

_Layer_Marker_GeneralRoute.put(
  {
    path: `/:_id`,
    validation: {
      // prettier-ignore
      schema: {
        params: Joi.object().keys({
          _id: Joi.objectId()
        }).required(),
        body: Joi.object().keys({
          MarkerName: Joi.string(),
          Address: Joi.string(),
          Tel: Joi.string(),
          Network: Joi.string(),
          Website: Joi.string(),
          Type: Joi.string(),
          Y: Joi.number(),
          X: Joi.number(),
          MaQH: Joi.string(),
          MaTP: Joi.string(),
          MaPX: Joi.string(),
          Key: Joi.string()
        }).required()
    }
    }
  },
  async (req, res, next) => {
    try {
      const _id = req.params._id
      const obj = await Layer_Marker_GeneralModel.findOne({ _id }, {}, { autopopulate: false })
      if (!obj) {
        throw new errors.ResourceNotFoundError(
          { info: { codeName: 'ResourceNotFound' } },
          `There is no Resource with the _id of ${_id}`
        )
      }
      let dataUpdate = req.body
      if (!obj.properties) obj.properties = {}

      _.mapKeys(dataUpdate, (val, key) => {
        if (key === 'X') {
          const Y = obj.geometry.coordinates[1]
          obj.geometry.coordinates = [val, Y]
        }
        if (key === 'Y') {
          const X = obj.geometry.coordinates[0]
          obj.geometry.coordinates = [X, val]
        }
        obj.properties[key] = val
      })
      obj.markModified('properties')

      obj.UpdatedBy = req.user ? req.user.Email : undefined
      await obj.save()

      res.json(obj)

      next()
    } catch (err) {
      next(err)
    }
  }
)
/* #endregion */

/* #region  POST Create */
_Layer_Marker_GeneralRoute.post(
  {
    path: ``,
    validation: {
      // prettier-ignore
      schema: {
          body: Joi.object().keys({
              MarkerName: Joi.string().required(),
              Y: Joi.number().required(),
              X: Joi.number().required(),
              Key: Joi.string().required(),
              Address: Joi.string(),
              Tel: Joi.string(),
              Network: Joi.string(),
              Website: Joi.string(),
              Type: Joi.string(),
              MaQH: Joi.string(),
              MaTP: Joi.string(),
              MaPX: Joi.string()
          }).required()
        }
    }
  },
  async (req, res, next) => {
    try {
      const { MarkerName, X, Y, Key, Address, Tel, Network, Website, Type, MaQH, MaTP, MaPX } = req.body
      const CreatedBy = req.user ? req.user.Email : undefined

      const payload = await Layer_Marker_GeneralModel.create({
        geometry: {
          type: 'Point',
          coordinates: [X, Y]
        },
        properties: {
          MarkerName,
          X,
          Y,
          Key,
          Address,
          Tel,
          Network,
          Website,
          Type,
          MaQH,
          MaTP,
          MaPX
        },
        CreatedBy
      })

      res.json(payload)

      next()
    } catch (err) {
      next(err)
    }
  }
)
/* #endregion */

deleteBy_id(
  _Layer_Marker_GeneralRoute,
  {
    path: `/:_id`
  },
  Layer_Marker_GeneralModel
)

export default _Layer_Marker_GeneralRoute
