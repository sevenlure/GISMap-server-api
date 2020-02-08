import restify from 'restify'
import errors from 'restify-errors'
import { Router } from 'restify-router'
import moment from 'moment'
import Joi from 'joi'
import joiObjectid from 'joi-objectid'
import NodeCache from 'node-cache'

import RoleModel from '~models/Role'
import UserAdminModel from '~models/UserAdmin'
import authenAdminMiddleware from '~middlewares/authenAdmin'
import { getListWithPagination, getAll, getBy_id, updateBy_id, deleteBy_id } from '../base'

Joi.objectId = joiObjectid(Joi)
const _roleRoute = new Router()
const KEY_CACHE_FORCE_LOGOUT = 'FORCE_LOGOUT'

_roleRoute.use(authenAdminMiddleware)
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
        },
    hookAfterSave: async obj => {
      const usersHaveRole = await UserAdminModel.find({ Role: obj._id })
      await UserAdminModel.updateMany({ Role: obj._id }, { $set: { isForceLogout: true } })
      if (usersHaveRole) {
        const tokens = usersHaveRole.filter(item => item.TokenLast != null).map(item => item.TokenLast)
        const oldCache = global._cache.get(KEY_CACHE_FORCE_LOGOUT) || []
        global._cache.set(KEY_CACHE_FORCE_LOGOUT, [...oldCache, ...tokens])
      }
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
      const CreatedBy = req.user ? req.user.Email : undefined

      const payload = await RoleModel.create({ Name, Description, RuleJson, CreatedBy })
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
