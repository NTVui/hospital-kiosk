const mongoose = require("mongoose");

const bhytRecordSchema = new mongoose.Schema({
  soBHYT: String,
  cccd: String,
  issueDate: Date,
  expireDate: Date,
  hospitalCode: String
}, {
  timestamps: true
});

const BhytRecord = mongoose.model("BhytRecord", bhytRecordSchema, "bhyt_records");

module.exports = BhytRecord;