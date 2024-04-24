const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { User } = db;
const { APISuccess } = require('../helpers/APIResponse');
// const { Op } = require('sequelize');

exports.signup = async (req, res) => {
    try {
        const { username, email, password, isAdmin } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword, isAdmin });
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP });
        const response = new APISuccess({
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin
                },
                token: token,
                message: 'User created successfully'
            }
        });
        res.send(response.jsonify());
    } catch (error) {
        res.status(500).json({ message: "Error signing up", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: {
                email
                // [Op.or]: [
                //     { username: username },
                // { email: email }
                // ]
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP });

        const response = new APISuccess({
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin
                },
                token: token,
                message: 'User login successfully'
            }
        });
        res.send(response.jsonify());
    } catch (error) {
        res.status(500).json({ message: "Error loggin in", error: error.message });
    }
};
