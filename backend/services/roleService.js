// services/roleService.js
const RoleModel = require('../models/roleModel');


class RoleService {
    static async getAllRoles() {
        return await RoleModel.getAll();
    }
}

module.exports = RoleService;