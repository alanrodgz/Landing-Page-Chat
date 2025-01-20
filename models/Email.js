import mongoose from "mongoose";

const { Schema } = mongoose;

const emailSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Ensures unique emails
    },
  },
  { timestamps: true }
);

export default mongoose.models.Email || mongoose.model("Email", emailSchema);