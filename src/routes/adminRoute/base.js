import mongoose from 'mongoose'
import Joi from 'joi'
import errors from 'restify-errors'
import * as _ from 'lodash'
Joi.objectId = require('joi-objectid')(Joi)
import { removeUnicodeText } from '~utils/funcUtil'

export async function getListWithPagination(router, { path, validationOp }, ModelTarget = mongoose.model()) {
  /* #region  get có Pagination */
  // { sort: { CreatedAt: -1 } }
  let validationSchema = {
    // prettier-ignore
    query: Joi.object().keys({
      pageSize: Joi.number().integer().min(1).max(1000),
      page:  Joi.number().integer(),
      Search:  Joi.string()
    }).required()
  }
  if (validationOp) validationSchema = _.merge(validationSchema, validationOp)
  router.get(
    {
      path,
      validation: {
        schema: validationSchema
      }
    },
    async (req, res, next) => {
      try {
        let query = req.query

        if (query.Search) {
          const regexSearch = await removeUnicodeText(query.Search)
          query.Search = new RegExp('' + regexSearch + '', 'i')
        }

        let dataWithPagination = await ModelTarget.getListWithPagination(query, { sort: { CreatedAt: -1 } })
        res.json(dataWithPagination)

        next()
      } catch (err) {
        next(err)
      }
    }
  )
  /* #endregion */
}

export async function getAll(router, { path, sort = {} }, ModelTarget = mongoose.model()) {
  router.get(
    {
      path
    },
    async (req, res, next) => {
      try {
        let data = await ModelTarget.find().sort(sort)

        res.json(data)
        next()
      } catch (err) {
        next(err)
      }
    }
  )
}

export async function getBy_id(router, { path, validationOp }, ModelTarget = mongoose.model()) {
  let validationSchema = {
    // prettier-ignore
    params: Joi.object().keys({
      _id: Joi.objectId()
    }).required()
  }
  if (validationOp) validationSchema = _.merge(validationSchema, validationOp)
  router.get(
    {
      path,
      validation: { schema: validationSchema }
    },
    async (req, res, next) => {
      try {
        const _id = req.params._id
        const obj = await ModelTarget.findById(_id)

        if (!obj) {
          throw new errors.ResourceNotFoundError(
            { info: { codeName: 'ResourceNotFound' } },
            `There is no Resource with the _id of ${_id}`
          )
        }

        res.json(obj)
        next()
      } catch (err) {
        next(err)
      }
    }
  )
}

export async function updateBy_id(
  router,
  { path, validationOp, omitFieldUpdate = [], hookBeforeSave, hookAfterSave },
  ModelTarget = mongoose.model()
) {
  // prettier-ignore
  let validationSchema = {
    params: Joi.object().keys({
      _id: Joi.objectId()
    }).required(),
    body: Joi.object().keys({
    }).required()
  }
  if (validationOp) validationSchema = _.merge(validationSchema, validationOp)
  router.put(
    {
      path,
      validation: { schema: validationSchema }
    },
    async (req, res, next) => {
      try {
        const _id = req.params._id
        const obj = await ModelTarget.findOne({ _id }, {}, { autopopulate: false })

        if (!obj) {
          throw new errors.ResourceNotFoundError(
            { info: { codeName: 'ResourceNotFound' } },
            `There is no Resource with the _id of ${_id}`
          )
        }

        let dataUpdate = req.body
        dataUpdate = _.omit(dataUpdate, omitFieldUpdate)
        _.mapKeys(dataUpdate, (val, key) => {
          obj[key] = val
        })

        obj.UpdatedBy = req.user ? req.user.Email : undefined
        if (hookBeforeSave) await hookBeforeSave(req, res)
        await obj.save()
        if (hookAfterSave) await hookAfterSave(obj)

        res.json(obj)

        next()
      } catch (err) {
        next(err)
      }
    }
  )
}

export async function deleteBy_id(router, { path, validationOp, hookBeforeRemove }, ModelTarget = mongoose.model()) {
  let validationSchema = {
    // prettier-ignore
    params: Joi.object().keys({
      _id: Joi.objectId()
    }).required()
  }
  if (validationOp) validationSchema = _.merge(validationSchema, validationOp)
  router.del(
    {
      path,
      validation: { schema: validationSchema }
    },
    async (req, res, next) => {
      try {
        const _id = req.params._id
        const obj = await ModelTarget.findById(_id)

        if (!obj) {
          throw new errors.ResourceNotFoundError(
            { info: { codeName: 'ResourceNotFound' } },
            `There is no Resource with the _id of ${_id}`
          )
        }

        obj.UpdatedBy = req.user ? req.user.Email : undefined
        if (hookBeforeRemove) await hookBeforeRemove(req, res, obj)
        await obj.remove()
        res.json(true)

        next()
      } catch (err) {
        next(err)
      }
    }
  )
}
