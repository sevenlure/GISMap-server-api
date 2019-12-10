import restify from 'restify'
import errors from 'restify-errors'
import { Router } from 'restify-router'
// import moment from "moment";
import Joi from 'joi'

import configs from '~constants/configs'
import { ConfigTampError } from '~constants/errorsName/config'

const PREPATH = '/config'
const _configRoute = new Router()

_configRoute.get('', async (req, res, next) => {
  try {
    res.json(configs)
    next()
  } catch (e) {
    next(e)
  }
})

_configRoute.post(
  {
    path: '/:id',
    validation: {
      // prettier-ignore
      schema: Joi.object().keys({
        params: Joi.object().keys({
          id: Joi.number().min(0).required()
        }).required(),
        body: Joi.object().keys({
          id: Joi.number().min(0).required(),
          name: Joi.number().required()
        }).required()
      })
    }
  },
  async (req, res, next) => {
    try {
      res.json(configs)
      next()
    } catch (e) {
      next(e)
    }
  }
)

export default _configRoute
