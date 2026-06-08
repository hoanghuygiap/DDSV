// controllers/roleController.js
const RoleService = require('../services/roleService');

exports.getRoles = async (req, res) => {
    try {
        const roles = await RoleService.getAllRoles();
        res.status(200).json({ success: true, data: roles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};