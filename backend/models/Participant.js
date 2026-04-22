import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        role: {
            type: String,
            enum: ["GOV", "MANUFACTURER", "PHARMACY"],
            required: true
        }
    },{timestamps: true}
);

export default mongoose.model("Participant", participantSchema)