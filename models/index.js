// models/index.js

// const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const { Sequelize, DataTypes } = require('sequelize');

// Initialize models
const User = require('./user');
const Question = require('./question');
const Contest = require('./contest');
const UserAnswer = require('./userAnswer');

const db = {};

db.Sequlize = Sequelize;
db.sequelize = sequelize;

db.User = User(sequelize, DataTypes);
db.Contest = Contest(sequelize, DataTypes);
db.Question = Question(sequelize, DataTypes, db.Contest);
db.UserAnswer = UserAnswer(sequelize, DataTypes, db.Question, db.User);

db.User.belongsToMany(db.Question, { through: db.UserAnswer });
db.Question.belongsToMany(db.User, { through: db.UserAnswer });
db.Contest.hasMany(db.Question);
db.Question.belongsTo(db.Contest);

// Export models
module.exports = db;
