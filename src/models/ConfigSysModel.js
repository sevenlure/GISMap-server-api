// Bảng lưu trữ danh sách các config Các key gồm có: qaqc, aqi-calculation, aqi-qc ...
import mongoose from 'mongoose'
const ConfigSys = {
  name: 'configSys',
  schema: new mongoose.Schema({
    key: {
      type: String,
      unique: true
    },
    name: String,
    value: mongoose.Schema.Types.Mixed,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  })
};

export default ConfigSys
