import mongoose, { Schema } from "mongoose";

const ExamAttemptSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    score: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "submitted", "evaluated"],
      default: "pending",
    },
    isAllowed: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    dob: Date,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
    },
    gender: { type: String },

    aadharCard: {
      number: { type: String, required: true },
      image: { type: String, required: true },
    },

    currentlyAllowed: {
      type: Boolean,
      default: false,
    },

    examAttempts: [ExamAttemptSchema],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
