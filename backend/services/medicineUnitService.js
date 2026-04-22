import {v4 as uuidv4} from "uuid";
import MedicineUnit from "../models/MedicineUnit.js";


export const createUnit = async({
    drugTypeId,
    manufacturerId,
    expirationDate
}) => {
    const uuid = uuidv4();

    const unit = await MedicineUnit.create({
        uuid,
        drugTypeId,
        manufacturerId,
        currentOwner: manufacturerId,
        expirationDate
    });

    return unit
};

export const transferOwnership = async({
    uuid,
    fromUserId,
    toUserId
}) =>{
    const unit = await MedicineUnit.findOne({uuid});

    if(!unit) throw new Error("Medicine unit not found");

    if(unit.currentOwner.toString() !== fromUserId){
        throw new Error("Unauthorized transfer")
    };

    if(new Date(unit.expirationDate)< new Date()){
        throw new Error("Cannot transfer expired medicine")
    }

    unit.currentOwner = toUserId;
    unit.status = "IN_TRANSIT";

    await unit.save();

    return unit;
 };

 export const verifyUnit = async (uuid) =>{
    const unit = await MedicineUnit.findOne({ uuid });

    if(!unit) throw new Error("Unit not found");

    await unit.populate("drugTypeId");
    await unit.populate("manufacturerId");
    await unit.populate("currentOwner");

    let status = unit.status;

    if(new Date(unit.expirationDate) < new Date()){
        status = "EXPIRED";
    }

    return{
        uuid: unit.uuid,
        drugType: unit.drugTypeId?.name,
        manufacturer: unit.manufacturerId?.name,
        currentOwner: unit.currentOwner?.name,
        expirationDate: unit.expirationDate,
        status
    }
 }