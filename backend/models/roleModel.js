// models/roleModel.js
const db = require('../config/db');

class RoleModel {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM vai_tro');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM vai_tro WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = RoleModel;