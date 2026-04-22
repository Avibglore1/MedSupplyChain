import mongoose from "mongoose";
import { isUUIDv4 } from "../utils/validator.js";

const medicineUnitSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: isUUIDv4,
                message: "Invalid UUID v4 format"
            },
        },
        drugTypeId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "DrugType",
            required: true
        },
        manufacturerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Participant",
            required: true
        },
        currentOwner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Participant",
            required: true,
            index: true
        },
        status: {
            type: String,
            enum: ["CREATED", "IN_TRANSIT", "SOLD"],
            default: "CREATED",
            index: true
        },
        expirationDate: {
            type: Date,
            required: true
        }
    },{timestamps: true}
);

medicineUnitSchema.index({uuid: 1});

export default mongoose.model("MedicineUnit", medicineUnitSchema)