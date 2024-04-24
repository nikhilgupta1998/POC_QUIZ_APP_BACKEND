module.exports = (sequelize, DataTypes, Contest) => {
    const Question = sequelize.define('Question', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: true
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        question: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hint: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ContestId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Contest,
                key: 'id'
            }
        }
    })
    return Question;
}