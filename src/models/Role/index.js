import mongoose from "mongoose";
import relationship from "mongoose-relationship";
import { getListWithPagination } from '../base'

const Schema = mongoose.Schema;

const RoleSchema = new mongoose.Schema(
  {
    // PolicyInfoGroup: { type: Schema.ObjectId, ref: 'PolicyInfoGroupModel', childPath: 'PolicyInfoList' },
    Name: { type: String, required: true },
    Description: String,
    RuleJson: { type: Object, default: {} }
  },
  {
    timestamps: { createdAt: "CreatedAt", updatedAt: "UpdatedAt" }
  }
);

RoleSchema.statics.getListWithPagination = getListWithPagination
// PolicyInfoSchema.plugin(relationship, { relationshipPathName: 'PolicyInfoGroup' })
export default mongoose.model("RoleModel", RoleSchema, "Role");
