import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISkill extends Document {
  _id: Types.ObjectId
  name: string;
  category: mongoose.Types.ObjectId;
}
const SkillSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  }
});
export default mongoose.model<ISkill>("Skill", SkillSchema);
