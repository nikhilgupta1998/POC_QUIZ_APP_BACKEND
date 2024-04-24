const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage });

router.get('/', authMiddleware, questionController.getAllQuestions);
router.post('/add', authMiddleware, upload.single('image'), questionController.addQuestion);
router.put('/add/:questionId', authMiddleware, upload.single('image'), questionController.updateQuestion);
router.delete('/add/:questionId', authMiddleware, questionController.deleteQuestion);
router.post('/contest', authMiddleware, questionController.addContest);
router.put('/contest/:contestId', authMiddleware, questionController.updateContest);
router.delete('/contest/:contestId', authMiddleware, questionController.deleteContest);
router.get('/contest', authMiddleware, questionController.getAllContests);
router.get('/quiz', authMiddleware, questionController.getAllQuiz);
router.post('/answer', authMiddleware, questionController.answerQuestion);
router.get('/user-answers/:userId', authMiddleware, questionController.getUserAnswers);
router.get('/contest/:contestId', authMiddleware, questionController.getQuestionsByContestId);

module.exports = router;
