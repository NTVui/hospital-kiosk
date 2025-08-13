const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema({
    tenPhongKham: String,
    maPhongKham: String,
    status: String,
    position: String,
    bacSiPhuTrach: String,
    description: String,
    // createdBy:{
    //     account_id: String,
        
    //     // createdAt: {
    //     //     type: Date,
    //     //     default: Date.now
    //     // }
    // },
    // slug: { 
    //     type: String, 
    //     slug: "tenPhongKham",
    //     unique: true
    // },
    // deleted: {
    //     type: Boolean,
    //     default: false
    // },
    // deletedBy: {
    //     account_id: String,
    //     deletedAt: Date
    // },
    
    // updatedBy:[
    // {
    //      account_id: String,
    //     // updatedAt: Date
    // }  
    // ]
}, {
    timestamps: true
});
const Clinic = mongoose.model("Clinic",clinicSchema, "clinics");

module.exports = Clinic;