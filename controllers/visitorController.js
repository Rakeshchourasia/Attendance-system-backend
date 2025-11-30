const Visitor = require('../models/visitor');

// @desc    Register a new visitor
// @route   POST /api/visitors
const registerVisitor = async (req, res) => {
  try {
    const { fullName, phone, visitorType, purpose, hostName, validUntil } = req.body;

    if (!fullName || !phone || !purpose || !hostName) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Generate Unique Pass ID
    const passId = `VIS-${Math.floor(1000 + Math.random() * 9000)}`;

    // Calculate Expiration
    let expirationDate;
    if (visitorType === 'oneday') {
      expirationDate = new Date();
      expirationDate.setHours(23, 59, 59, 999);
    } else {
      expirationDate = validUntil ? new Date(validUntil) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      expirationDate.setHours(23, 59, 59, 999);
    }

    const visitor = await Visitor.create({
      passId,
      fullName,
      phone,
      visitorType,
      purpose,
      hostName,
      validUntil: expirationDate
    });

    res.status(201).json(visitor);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Scan visitor pass (Check-in / Check-out)
// @route   POST /api/visitors/scan
const scanVisitor = async (req, res) => {
  try {
    const { passId } = req.body;

    if (!passId) {
      return res.status(400).json({ message: 'Pass ID is required' });
    }

    const visitor = await Visitor.findOne({ passId });

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    // Check if expired
    if (new Date() > new Date(visitor.validUntil)) {
      visitor.status = 'Expired';
      await visitor.save();
      return res.status(400).json({ message: 'Pass Expired', visitor });
    }

    // Logic: 
    // 1. If status is Registered -> Check In (Active)
    // 2. If status is Active -> Check Out (Checked Out)
    // 3. If status is Checked Out -> Error (Already used)

    if (visitor.status === 'Registered' || !visitor.checkInTime) {
      // First Scan: Check In
      visitor.checkInTime = new Date();
      visitor.status = 'Active';
      await visitor.save();
      return res.json({ message: 'Check-In Successful', type: 'check-in', visitor });

    } else if (visitor.status === 'Active') {
      // Second Scan: Check Out
      visitor.checkOutTime = new Date();
      visitor.status = 'Checked Out';
      await visitor.save();
      return res.json({ message: 'Check-Out Successful', type: 'check-out', visitor });

    } else if (visitor.status === 'Checked Out') {
      return res.status(400).json({ message: 'Pass already used for Check-Out', visitor });
    }

    res.json(visitor);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all visitors
// @route   GET /api/visitors
const getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { registerVisitor, getVisitors, scanVisitor };