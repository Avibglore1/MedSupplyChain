import mongoose from "mongoose";

const licenseSchema = new mongoose.Schema({
    drugTypeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DrugType",
        required: true
    },
    manufacturerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
        required: true
    },
    status: {
        type: String,
        enum: ["VALID", "REVOKED"],
        default: "VALID"
    },
    expiresAt: {
        type: Date,
        required: true
    }
},{timestamps: true});

export default mongoose.model("License", licenseSchema)