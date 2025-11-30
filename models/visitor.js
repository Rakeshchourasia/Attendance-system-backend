const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  passId: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'Please add a name']
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  visitorType: {
    type: String,
    enum: ['oneday', 'multiday'],
    default: 'oneday'
  },
  purpose: {
    type: String,
    required: [true, 'Please add a purpose']
  },
  hostName: {
    type: String,
    required: [true, 'Please add who they are visiting']
  },
  validUntil: {
    type: Date,
    required: true
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Registered', 'Active', 'Checked Out', 'Expired'],
    default: 'Registered'
  }
}, {
  timestamps: true
});

const Visitor = mongoose.model('Visitor', visitorSchema);
module.exports = Visitor;