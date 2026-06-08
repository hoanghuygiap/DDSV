// services/userService.js
const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

class UserService {
    static async getAllUsers(limit, offset) {
        return await UserModel.getAll(limit, offset);
    }

    static async getUserById(id) {
        const user = await UserModel.getById(id);
        if (!user) throw new Error('Tài khoản không tồn tại');
        return user;
    }

    static async createUser(data) {
        // Kiểm tra username/email trùng lặp
        const existingUser = await UserModel.getByUsername(data.username);
        if (existingUser) throw new Error('Tên đăng nhập đã tồn tại');

        if (data.email) {
            const existingEmail = await UserModel.getByEmail(data.email);
            if (existingEmail) throw new Error('Email đã được sử dụng');
        }

        // Hash mật khẩu của người dùng
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(data.password, salt);

        const userId = await UserModel.create({
            username: data.username,
            password_hash,
            ho_ten: data.ho_ten || null,
            email: data.email || null
        });

        // Gán vai trò mặc định (Ví dụ: sinh_vien có ID là 3)
        const defaultRoleId = data.roleId || 3; 
        await UserModel.assignRole(userId, defaultRoleId);

        return await UserModel.getById(userId);
    }

    static async updateUser(id, data) {
        await this.getUserById(id); // Check xem user có tồn tại không

        const updateFields = {};
        if (data.ho_ten !== undefined) updateFields.ho_ten = data.ho_ten;
        if (data.email !== undefined) updateFields.email = data.email;
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            updateFields.password_hash = await bcrypt.hash(data.password, salt);
        }

        if (data.roleId) {
            await UserModel.removeRoles(id);
            await UserModel.assignRole(id, data.roleId);
        }

        await UserModel.update(id, updateFields);
        return await UserModel.getById(id);
    }

    static async deleteUser(id) {
        await this.getUserById(id);
        return await UserModel.delete(id);
    }

    static async lockUser(id, minutes = 15) {
        await this.getUserById(id);
        const lockUntil = new Date(Date.now() + minutes * 60000);
        return await UserModel.update(id, { 
            kich_hoat: false, 
            lock_until: lockUntil 
        });
    }

    static async unlockUser(id) {
        await this.getUserById(id);
        return await UserModel.update(id, { 
            kich_hoat: true, 
            lock_until: null, 
            failed_attempts: 0 
        });
    }
}

module.exports = UserService;