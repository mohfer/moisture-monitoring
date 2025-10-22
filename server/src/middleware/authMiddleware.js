const { verifyToken } = require('../helpers/jwtHelper');
const { sendError } = require('../helpers/responseHelper');

exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 'No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return sendError(res, 'Invalid or expired token', 401);
    }

    req.user = decoded;
    next();
};
