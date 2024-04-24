module.exports = (sequelize, DataTypes, Question, User) => {
    const UserAnswer = sequelize.define('UserAnswer', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: true
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        QuestionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Question,
                key: 'id'
            }
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isCorrect: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
    return UserAnswer;
}