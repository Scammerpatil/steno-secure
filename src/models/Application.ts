import mongoose, { Schema, model, models } from "mongoose";

const ApplicationSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    married: {
      type: String,
      required: true,
    },
    dependents: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      required: true,
    },
    selfEmployed: {
      type: String,
      required: true,
    },
    applicantIncome: {
      type: Number,
      required: true,
    },
    coapplicantIncome: {
      type: Number,
      required: true,
    },
    loanAmount: {
      type: Number,
      required: true,
    },
    loanAmountTerm: {
      type: Number,
      required: true,
    },
    creditHistory: {
      type: String,
      required: true,
    },
    propertyArea: {
      type: String,
      required: true,
    },

    // AI Model Prediction Result
    eligibilityScore: {
      type: Number,
      default: null,
    },
    modelResult: {
      type: String,
      enum: ["Eligible", "Not Eligible"],
      default: null,
    },

    // Admin Status
    adminStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    adminRemarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Application =
  mongoose.models.Application || model("Application", ApplicationSchema);
export default Application;
