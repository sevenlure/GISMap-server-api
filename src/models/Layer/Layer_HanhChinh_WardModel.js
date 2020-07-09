import mongoose from 'mongoose'

const Schema = new mongoose.Schema({
  type: String,
  properties: Object,
  geometry: Object,

  CreatedBy: String,
  UpdatedBy: String
}, {
  timestamps: { createdAt: "CreatedAt", updatedAt: "UpdatedAt" }
})

Schema.index({ geometry: '2dsphere' })
export default mongoose.model('Layer_HanhChinh_WardModel', Schema, 'Layer_HanhChinh_Ward')
