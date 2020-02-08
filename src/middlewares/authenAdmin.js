import errors from 'restify-errors'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_SECRET_ADMIN } from '~root/configSys'

const KEY_CACHE_FORCE_LOGOUT = 'FORCE_LOGOUT'

export default async function(req, res, next) {
  try {
    const token = getToken(req)
    var decoded = jwt.verify(token, JWT_SECRET_ADMIN)
    req.user = decoded
    const { Email } = decoded
    if (Email === 'admin@superadmin.com') return next()

    const tokensForceLogout = global._cache.get(KEY_CACHE_FORCE_LOGOUT) || []
    if (tokensForceLogout.includes(token)) {
      throw new errors.InvalidCredentialsError(
        {
          info: { codeName: 'AuthForceLogout' }
        },
        `user must force logout`
      )
    }
    next()
  } catch (err) {
    next(err)
  }
}

const getToken = function(req) {
  const authorization = _.get(req, 'headers.authorization', ' ')
  if (authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1]
  } else if (req.query && req.query.token) {
    return req.query.token
  }
  throw new errors.InvalidCredentialsError(
    {
      info: { codeName: 'AuthNoToken' }
    },
    `No authorization token was found`
  )
}
