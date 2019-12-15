import mongoose from 'mongoose'

const Schema = new mongoose.Schema({
  type: String,
  properties: Object,
  geometry: Object
})

Schema.index({ geometry: '2dsphere' })
export default mongoose.model('Layer_HanhChinh_DistrictModel', Schema, 'Layer_HanhChinh_District')