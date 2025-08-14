const mongoose = require("mongoose");

const bhytRecordSchema = new mongoose.Schema({
  cccd: {
    type: String,
    required: true,
    unique: true
  },
  soBHYT: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

const BhytRecord = mongoose.model("BhytRecord", bhytRecordSchema, "bhyt_records");

module.exports = BhytRecord;