import restify from 'restify'
import errors from 'restify-errors'
import { Router } from 'restify-router'
import moment from 'moment'
import Joi from 'joi'
import joiObjectid from 'joi-objectid'

import RoleModel from '~models/Role'
import { getListWithPagination, getAll, getBy_id, updateBy_id, deleteBy_id } from '../base'

Joi.objectId = joiObjectid(Joi)
const _roleRoute = new Router()

getListWithPagination(_roleRoute, { path: '' }, RoleModel)

getBy_id(_roleRoute, { path: `/:_id` }, RoleModel)

/* #region  getALL */
_roleRoute.get(
  {
    path: `/getAll`
  },
  async (req, res, next) => {
    try {
      let data = await RoleModel.find().sort({ CreatedAt: -1 })

      res.json(data)
      next()
    } catch (err) {
      next(err)
    }
  }
)
/* #endregion */

/* #region  updateBy_id */
updateBy_id(
  _roleRoute,
  {
    path: `/:_id`,
    // prettier-ignore
    validationOp: {
            body: Joi.object().keys({
              Name: Joi.string(),
              Description: Joi.string(),
              RuleJson: Joi.object()
            }).required()
          }
    // omitFieldUpdate: ['Type'],
    // hookBeforeSave: functionHook
  },
  RoleModel
)
/* #endregion */

/* #region  POST Create */
_roleRoute.post(
  {
    path: ``,
    validation: {
      // prettier-ignore
      schema: {
          body: Joi.object().keys({
            Name: Joi.string(),
            Description: Joi.string(),
            RuleJson: Joi.object()
          }).required()
        }
    }
  },
  async (req, res, next) => {
    try {
      const { Name, Description, RuleJson } = req.body

      const payload = await RoleModel.create({ Name, Description, RuleJson })
      res.json(payload)

      next()
    } catch (err) {
      next(err)
    }
  }
)
/* #endregion */

deleteBy_id(
  _roleRoute,
  {
    path: `/:_id`
  },
  RoleModel
)

export default _roleRoute
