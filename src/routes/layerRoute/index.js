import restify from 'restify'
import errors from 'restify-errors'
import { Router } from 'restify-router'
import moment from 'moment'
import Joi from 'joi'

import Layer_HanhChinh_ProvinceModel from '~models/Layer/Layer_HanhChinh_ProvinceModel'
import Layer_HanhChinh_DistrictModel from '~models/Layer/Layer_HanhChinh_DistrictModel'
import Layer_HanhChinh_WardModel from '~models/Layer/Layer_HanhChinh_WardModel'
import Layer_Marker_GeneralModel from '~models/Layer/Layer_Marker_GeneralModel'

const KEY_CACHE = {
  getAllHanhChinh: 'getAllHanhChinh'
}
const _layerRoute = new Router()

// init

_layerRoute.get('/getAllHanhChinh', async (req, res, next) => {
  try {
    let payload = global._cache.get(KEY_CACHE.getAllHanhChinh)
    if (payload == undefined) {
      payload = {
        province: await Layer_HanhChinh_ProvinceModel.find({}),
        district: await Layer_HanhChinh_DistrictModel.find({}),
        ward: await Layer_HanhChinh_WardModel.find({})
      }
      global._cache.set(KEY_CACHE.getAllHanhChinh, payload)
    }
    res.json(payload)
    next()
  } catch (e) {
    next(e)
  }
})

// _layerRoute.get('/marker-general/:key/getall', async (req, res, next) => {
//   try {
//     // let payload = global._cache.get(KEY_CACHE.getAllHanhChinh)
//     // if (payload == undefined) {
//     //   payload = {
//     //     province: await Layer_HanhChinh_ProvinceModel.find({}),
//     //     district: await Layer_HanhChinh_DistrictModel.find({}),
//     //     ward: await Layer_HanhChinh_WardModel.find({})
//     //   }
//     //   global._cache.set(KEY_CACHE.getAllHanhChinh, payload)
//     // }
//     // let payload = await Layer_Marker_GeneralModel
//     // res.json(payload)
//     next()
//   } catch (e) {
//     next(e)
//   }
// })

// _configRoute.post(
//   {
//     path: '/:id',
//     validation: {
//       // prettier-ignore
//       schema: Joi.object().keys({
//         params: Joi.object().keys({
//           id: Joi.number().min(0).required()
//         }).required(),
//         body: Joi.object().keys({
//           id: Joi.number().min(0).required(),
//           name: Joi.number().required()
//         }).required()
//       })
//     }
//   },
//   async (req, res, next) => {
//     try {
//       res.json(configs)
//       next()
//     } catch (e) {
//       next(e)
//     }
//   }
// )

export default _layerRoute
