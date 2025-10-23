const { User } = require('../models');
const { sendResponse, sendError } = require('../helpers/responseHelper');
const { generateToken } = require('../helpers/jwtHelper');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendError(res, 'Email and password are required', 400);
        }

        const user = await User.findOne({
            where: { email }
        });

        if (!user) return sendError(res, 'User not found', 404);

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) return sendError(res, 'Invalid password', 401);

        const safeUser = { id: user.id, name: user.name, email: user.email };

        const token = generateToken(safeUser);

        return sendResponse(res, { user: safeUser, token }, 'Login successful');
    } catch (error) {
        return sendError(res, error.message);
    }
};
