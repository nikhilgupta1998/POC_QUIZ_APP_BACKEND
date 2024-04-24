const db = require('../models');
const { Question, UserAnswer, Contest } = db;
const { APISuccess } = require('../helpers/APIResponse');
const ImageKit = require("imagekit");
const fsPromises = require('fs').promises;

const imagekit = new ImageKit({
    publicKey: `${process.env.IMAGE_KIT_PUBLIC_KEY}`,
    privateKey: `${process.env.IMAGE_KIT_PRIVATE_KEY}`,
    urlEndpoint: `${process.env.IMAGE_KIT_ENDPOINT}`
});

exports.getAllQuestions = async (req, res) => {
    try {
        const data = await Question.findAll({});
        const response = new APISuccess({ data: data });
        res.send(response.jsonify());
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
}

exports.getAllContests = async (req, res) => {
    try {
        const data = await Contest.findAll({});
        const response = new APISuccess({ data: data });
        res.send(response.jsonify());
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
}

exports.getAllQuiz = async (req, res) => {
    try {
        const data = await Contest.findAll({
            where: {
                isLive: true
            }
        });
        const response = new APISuccess({ data: data });
        res.send(response.jsonify());
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
}

exports.addContest = async (req, res) => {
    try {
        const { title, description, isLive } = req.body;
        const data = await Contest.create({ title, description, isLive });
        const response = new APISuccess({ data: data });
        res.send(response.jsonify());
    } catch (error) {
        res.status(500).json({ message: 'Error creating contest', error: error.message });
    }
}

exports.updateContest = async (req, res) => {
    try {
        const { contestId } = req.params;
        const { title, description, isLive } = req.body;
        const result = await Contest.update({ title, description, isLive }, {
            where: { id: contestId }
        })
        const response = new APISuccess({
            data: {
                contest: result,
                message: "Contest updated successfully"
            }
        })
        res.send(response.jsonify());
    } catch (error) {
        res.status(500).json({ message: 'Error updating contest', error: error.message });
    }
}

exports.deleteContest = async (req, res) => {
    try {
        const { contestId } = req.params;
        const contest = await Contest.destroy({
            where: { id: contestId }
        })
        let question;
        if (contest) {
            question = await Question.destroy({
                where: {
                    ContestId: contestId
                }
            });
        }
        const response = new APISuccess({
            data: {
                contest: contest,
                question: question,
                message: "Contest deleted and questions successfully"
            }
        })
        res.send(response.jsonify());
    } catch (error) {
        res.status(500).json({ message: 'Error updating contest', error: error.message });
    }
}

exports.getQuestionsByContestId = async (req, res) => {
    try {
        const { contestId } = req.params;
        let questions = [];
        const contest = await Contest.findByPk(contestId);
        if (contest) {
            questions = await Question.findAll({
                where: {
                    ContestId: contest.id
                }
            })
        }
        const response = new APISuccess({
            data: {
                contest: contest,
                questions: questions
            }
        });
        res.send(response.jsonify());
    } catch (error) {
        res.status(500).json({ message: 'Error creating contest', error: error.message });
    }
}

exports.addQuestion = async (req, res) => {
    try {
        const { ContestId, hint, question, answer } = req.body;
        const fileBuffer = await fsPromises.readFile(req.file.path);
        const imageUpload = await imagekit.upload({
            file: fileBuffer, // Path to the file
            fileName: req.file.originalname, // Original filename
            useUniqueFilename: true // Ensure unique filenames
        });

        const imageUrl = imageUpload.url;
        const data = await Question.create({ imageUrl, ContestId, hint, question, answer });
        const response = new APISuccess({ data: data });
        res.send(response.jsonify());
    } catch (error) {
        res.status(500).json({ message: "Error adding question", error: error.message });
    }
}

exports.updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { ContestId, hint, question, answer, image } = req.body;

        let imageUrl;
        if (image) {
            imageUrl = image;
        } else {
            const fileBuffer = await fsPromises.readFile(req.file.path);
            const imageUpload = await imagekit.upload({
                file: fileBuffer, // Path to the file
                fileName: req.file.originalname, // Original filename
                useUniqueFilename: true // Ensure unique filenames
            });
            imageUrl = imageUpload.url;
        }

        const data = await Question.update({ imageUrl, ContestId, hint, question, answer }, {
            where: {
                id: questionId
            }
        });
        const response = new APISuccess({
            data: {
                question: data,
                message: "Question updated successfully"
            }
        });
        res.send(response.jsonify());
    } catch (error) {
        res.status(500).json({ message: "Error adding question", error: error.message });
    }
}

exports.deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        const data = await Question.destroy({
            where: {
                id: questionId
            }
        });
        const response = new APISuccess({
            data: {
                question: data,
                message: "Question deleted successfully"
            }
        });
        res.send(response.jsonify());
    } catch (error) {
        res.status(500).json({ message: "Error adding question", error: error.message });
    }
}

exports.answerQuestion = async (req, res) => {
    try {
        const { UserId, QuestionId, answer } = req.body;
        const question = await Question.findByPk(QuestionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        const isCorrect = question.answer.toLowerCase() === answer.toLowerCase();
        const data = await UserAnswer.create({ UserId, QuestionId, answer, isCorrect });
        const response = new APISuccess({
            data: {
                question: data,
                message: "Answer submitted successfully"
            }
        });
        res.send(response.jsonify());
    } catch (error) {
        res.status(500).json({ message: 'Error submitting answer', error: error.message });
    }
};

exports.getUserAnswers = async (req, res) => {
    try {
        const { userId } = req.params;
        const userAnswers = await UserAnswer.findAll({ where: { UserId: userId }, include: [Question] });
        const response = new APISuccess({ data: userAnswers });
        res.send(response.jsonify());
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user answers', error: error.message });
    }
};