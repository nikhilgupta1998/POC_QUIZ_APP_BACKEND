const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/user-result', authMiddleware, adminController.getUserQuizResult);
router.post('/users-quiz-results', authMiddleware, adminController.getUserListAttendedContest);
router.get('/winner', authMiddleware, adminController.getWinner);

module.exports = router;