const db = require('../models');
const { User, UserAnswer, Question } = db;

const { APISuccess } = require('../helpers/APIResponse');

exports.getUserQuizResult = async (req, res) => {
    try {
        const { userId, contestId } = req.body;
        const usersAttended = await User.findByPk(userId, {
            // attributes: ['userId'],
            // group: ['userId'],
            attributes: { exclude: ['password', 'isAdmin', 'createdAt', 'updatedAt'] },
            include: [{
                model: Question,
                where: {
                    ContestId: contestId,
                },
                attributes: { exclude: ['createdAt', 'updatedAt', 'ContestId'] }
                // attributes: ['id', 'username'] // Adjust attributes as per your User model
            }]
        });
        const response = new APISuccess({ data: usersAttended });
        res.send(response.jsonify());
    } catch (error) {
        console.error("Error retrieving attendance list:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getUserListAttendedContest = async (req, res) => {
    try {
        const { contestId } = req.body;
        const usersAttended = await User.findAll({
            // attributes: ['userId'],
            // group: ['userId'],
            attributes: { exclude: ['password', 'isAdmin', 'createdAt', 'updatedAt'] },
            include: [{
                model: Question,
                where: {
                    ContestId: contestId,
                },
                attributes: { exclude: ['createdAt', 'updatedAt', 'ContestId'] }
                // attributes: ['id', 'username'] // Adjust attributes as per your User model
            }]
        });
        const response = new APISuccess({ data: usersAttended });
        res.send(response.jsonify());
    } catch (error) {
        console.error("Error retrieving attendance list:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getWinner = async (req, res) => {
    try {
        const maxCorrectAnswers = await UserAnswer.max('isCorrect');
        const usersWithMaxCorrectAnswers = await UserAnswer.findAll({
            attributes: ['userId'],
            where: { isCorrect: maxCorrectAnswers },
            group: ['userId'],
            include: [{
                model: User,
                attributes: ['id', 'username'] // Adjust attributes as per your User model
            }]
        });
        const formattedWinners = usersWithMaxCorrectAnswers.map(user => ({
            id: user.User.id,
            username: user.User.username
        }));
        res.json({ winners: formattedWinners, maxCorrectAnswers });
    } catch (error) {
        console.error("Error retrieving winners list:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
