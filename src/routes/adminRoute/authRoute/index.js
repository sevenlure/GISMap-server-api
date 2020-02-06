import restify from 'restify'
import errors from 'restify-errors'
import { Router } from 'restify-router'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import UserAdminModel from '~models/UserAdmin'
import { JWT_SECRET_ADMIN } from '~root/configSys'

const _authRoute = new Router()

const init = async () => {
  const userAdmin = await UserAdminModel.findOne({
    Email: 'admin@superadmin.com'
  })
  if (!userAdmin) {
    await UserAdminModel.create({
      Email: 'admin@superadmin.com',
      FullName: 'Super Admin',
      Password: '123456'
    })
  }
}

/* #region  authen */
_authRoute.post(
  {
    path: '',
    validation: {
      // prettier-ignore
      schema: {
      body: Joi.object().keys({
        Email: Joi.string().email().required(),
        Password: Joi.string().required()
      }).required()
    }
    }
  },
  async (req, res, next) => {
    try {
      const { Email, Password } = req.body

      const user = await UserAdminModel.authenticate(Email, Password)
      if (!user) {
        throw new errors.UnauthorizedError(
          {
            info: { codeName: 'AuthorizationFail' }
          },
          `Authorization failed. Incorrect Email or Password.`
        )
      }

      let token = jwt.sign(user, JWT_SECRET_ADMIN, {
        // expiresIn: '2h' // token expires in 2h
      })

      // // retrieve issue and expiration times
      let { iat, exp } = jwt.decode(token)

      res.json({ iat, exp, token, ...user })
      next()
    } catch (err) {
      next(err)
    }
  }
)
/* #endregion */

init()
export default _authRoute
