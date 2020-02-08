import mongoose from 'mongoose'
import { getListWithPagination } from '../base'
import { getNameByKey } from '~constants/layer/general'
import * as _ from 'lodash'

const Schema = new mongoose.Schema(
  {
    type: { type: String, default: 'Feature' },
    properties: Object,
    geometry: Object,

    CreatedBy: String,
    UpdatedBy: String
  },
  {
    timestamps: { createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' }
  }
)

Schema.index({ geometry: '2dsphere' })

Schema.statics.getListWithPagination = getListWithPagination

// NOTE  Hooks
Schema.pre('save', async function(next) {
  this.properties.KeyName = getNameByKey(_.get(this.properties, 'Key'))
  next()
})
export default mongoose.model('Layer_Marker_GeneralModel', Schema, 'Layer_Marker_General')
