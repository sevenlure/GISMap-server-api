import restify from 'restify'
import errors from 'restify-errors'
import { Router } from 'restify-router'
import moment from 'moment'
import Joi from 'joi'
import joiObjectid from 'joi-objectid'

import UserAdminModel from '~models/UserAdmin'
import { getListWithPagination, getAll, getBy_id, updateBy_id, deleteBy_id } from '../base'
import authenAdminMiddleware from '~middlewares/authenAdmin'

Joi.objectId = joiObjectid(Joi)
const _userAdminRoute = new Router()

_userAdminRoute.use(authenAdminMiddleware)
getListWithPagination(_userAdminRoute, { path: '' }, UserAdminModel)

getBy_id(_userAdminRoute, { path: `/:_id` }, UserAdminModel)

/* #region  getALL */
_userAdminRoute.get(
  {
    path: `/getAll`
  },
  async (req, res, next) => {
    try {
      console.log('aaa')
      let data = await UserAdminModel.find().sort({ CreatedAt: -1 })

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
  _userAdminRoute,
  {
    path: `/:_id`,
    // prettier-ignore
    validationOp: {
      body: Joi.object().keys({
        FullName: Joi.string(),
        IsDisabled: Joi.boolean(),
        Role: Joi.objectId(),
      }).required()
    },
    omitFieldUpdate: ['Email', 'Password']
    // hookBeforeSave: functionHook
  },
  UserAdminModel
)
/* #endregion */

/* #region  POST Create */
_userAdminRoute.post(
  {
    path: ``,
    validation: {
      // prettier-ignore
      schema: {
          body: Joi.object().keys({
            Email: Joi.string().email().required(),
            Password: Joi.string().required(),
            FullName: Joi.string(),
            IsDisabled: Joi.boolean(),
            Role: Joi.objectId(),
          }).required()
        }
    }
  },
  async (req, res, next) => {
    try {
      const { Email, Password, FullName, IsDisabled, Role } = req.body

      let user = await UserAdminModel.findOne({
        Email: Email
      })
      if (user) throw new errors.InvalidContentError({ info: { codeName: 'UserEmailExist' } }, `Email is exist!`)

      const payload = await UserAdminModel.create({ Email, Password, FullName, IsDisabled, Role })
      res.json(payload)

      next()
    } catch (err) {
      next(err)
    }
  }
)
/* #endregion */

/* #region  PATCH Change Password */
_userAdminRoute.patch(
  {
    path: '/change-password/:_id',
    validation: {
      // prettier-ignore
      schema: {
        body: Joi.object().keys({
          Password: Joi.string().required(),
        }).required(),
        params: Joi.object().keys({
          _id: Joi.objectId()
        }).required()
      }
    }
  },
  async (req, res, next) => {
    try {
      const { Password } = req.body
      const { _id } = req.params

      let user = await UserAdminModel.findById(_id)
      if (!user)
        throw new errors.ResourceNotFoundError(
          { info: { codeName: 'ResourceNotFound' } },
          `There is no Resource with the _id of ${_id}`
        )

      user.Password = Password
      await user.save()

      res.json(_.omit(user.toJSON(), ['Password']))

      next()
    } catch (err) {
      next(err)
    }
  }
)
/* #endregion */

deleteBy_id(
  _userAdminRoute,
  {
    path: `/:_id`
  },
  UserAdminModel
)

export default _userAdminRoute
