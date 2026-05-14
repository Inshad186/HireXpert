// import mongoose, {Schema, Document} from "mongoose";

// export interface IReview extends Document {
//     _id: mongoose.Types.ObjectId;
//     client: mongoose.Types.ObjectId;
//     freelancer: mongoose.Types.ObjectId;
//     order: mongoose.Types.ObjectId;
//     rating: number;
//     feedback: string
//     createdAt: Date;
// }

// const reviewSchema = new Schema<IReview>({
//     client: {type: Schema.Types.ObjectId, ref: "ClientProfile"},
//     freelancer: {type: Schema.Types.ObjectId, ref: "FreelancerProfile"},
//     order: {type: Schema.Types.ObjectId, ref: "Order"},
//     rating: {type: Number},
//     feedback: {type: String}},
//     {
//     timestamps: true
//     }
// )

// export default mongoose.model<IReview>("Review", reviewSchema)