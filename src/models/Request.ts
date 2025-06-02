import mongoose, { Schema } from "mongoose";

const RequestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Request =
  mongoose.models.Request || mongoose.model("Request", RequestSchema);
export default Request;
