module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })
    return Admin;
}