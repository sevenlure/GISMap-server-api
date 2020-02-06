import mongoose from 'mongoose'
import relationship from 'mongoose-relationship'
import bcrypt from 'bcrypt'
import idvalidator from 'mongoose-id-validator'
import autopopulate from 'mongoose-autopopulate'
import uniqueValidator from 'mongoose-unique-validator'
import { removeUnicodeText } from '~utils/funcUtil'
import { getListWithPagination } from '../base'

const Schema = mongoose.Schema

const UserAdminSchema = new mongoose.Schema(
  {
    Email: { type: String, required: true, unique: true, lowercase: true },
    FullName: { type: String, required: true },
    SearchName: String,
    Password: {
      type: String,
      set: val => {
        return bcrypt.hashSync(val, 10)
      }
    },
    IsDisabled: { type: Boolean, default: false },
    Role: { type: Schema.ObjectId, ref: 'RoleModel', autopopulate: { maxDepth: 2 } },

    isForceLogout: { type: Boolean, default: false },
    TokenLast: String,
    TokenDevice: String,
    CreatedBy: String,
    UpdatedBy: String
  },
  {
    timestamps: { createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' }
  }
)

// MARK  function
UserAdminSchema.statics.authenticate = async function(email, password) {
  let user = await this.findOne({ Email: email })
  if (!user) return false

  let isAuthenticated = await bcrypt.compareSync(password, user.Password)
  if (!isAuthenticated) return false

  user.isForceLogout = false
  await user.save()
  let data = user.toJSON()

  return _.pick(data, ['_id', 'Email', 'FullName', 'Role'])
}
UserAdminSchema.statics.getListWithPagination = getListWithPagination

// MARK  Hook
UserAdminSchema.post('find', async function(docs) {
  for (let doc of docs) {
    doc.SearchName = removeUnicodeText(doc.FullName)
  }
})

// MARK  Plugin
UserAdminSchema.plugin(idvalidator)
UserAdminSchema.plugin(autopopulate)
UserAdminSchema.plugin(uniqueValidator)
export default mongoose.model('UserAdminModel', UserAdminSchema, 'UserAdmin')
