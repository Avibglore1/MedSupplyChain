import mongoose from "mongoose";

const drugTypeSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required: true,
            trim: true
        },
        description: {
            type: String
        }
    },{timestamps: true}
);

export default mongoose.model("DrugType", drugTypeSchema);