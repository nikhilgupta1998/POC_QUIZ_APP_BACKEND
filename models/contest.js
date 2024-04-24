module.exports = (sequelize, DataTypes) => {
    const Contest = sequelize.define('Contest', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        isLive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
        // Add any other fields you need for your contest
    });
    return Contest;
}
