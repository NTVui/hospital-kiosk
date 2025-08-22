const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const serviceSchema = new mongoose.Schema({
    tenDichVu: String,
    clinic_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
        required: true
        },
    price: Number,
    status: String,
    position: Number,
    description: String,
    discountPercentage: Number,
    thumbnail: String,
    createdBy:{
        account_id: String,
    },
    slug: { 
        type: String, 
        slug: "tenDichVu",
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
const Service = mongoose.model("Service",serviceSchema, "services");

module.exports = Service;