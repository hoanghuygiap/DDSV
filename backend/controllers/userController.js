// controllers/userController.js
const UserService = require('../services/userService');

exports.getUsers = async (req, res) => {
    try {
        const { limit = 10, offset = 0 } = req.query;
        const users = await UserService.getAllUsers(limit, offset);
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const newUser = await UserService.createUser(req.body);
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await UserService.updateUser(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await UserService.deleteUser(req.params.id);
        res.status(200).json({ success: true, message: 'Xóa tài khoản thành công' });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

exports.lockUser = async (req, res) => {
    try {
        const { minutes } = req.body;
        await UserService.lockUser(req.params.id, minutes);
        res.status(200).json({ success: true, message: `Khóa tài khoản thành công trong ${minutes || 15} phút` });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.unlockUser = async (req, res) => {
    try {
        await UserService.unlockUser(req.params.id);
        res.status(200).json({ success: true, message: 'Mở khóa tài khoản thành công' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};