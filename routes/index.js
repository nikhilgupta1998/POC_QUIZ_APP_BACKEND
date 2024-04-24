const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const questionRoutes = require('./question');
const adminRoutes = require('./admin');

router.use('/auth', authRoutes);
router.use('/questions', questionRoutes);
router.use('/admin', adminRoutes);

module.exports = router;