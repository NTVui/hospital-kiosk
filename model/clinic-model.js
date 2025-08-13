const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const clinicSchema = new mongoose.Schema({
    tenPhongKham: String,
    maPhongKham: String,
    status: String,
    position: Number,
    viTri: String,
    bacSiPhuTrach: String,
    description: String,
    thumbnail: String,
    createdBy:{
        account_id: String,
    },
    slug: { 
        type: String, 
        slug: "tenPhongKham",
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
    updatedBy:
    {
        account_id: String
    } 
}, {
    timestamps: true
});
const Clinic = mongoose.model("Clinic",clinicSchema, "clinics");

module.exports = Clinic;