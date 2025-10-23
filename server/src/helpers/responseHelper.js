exports.sendResponse = (res, data = null, message = 'Success', code = 200) => {
    return res.status(code).json({
        code: code,
        message: message,
        data: data,
    });
};

exports.sendError = (res, message = 'Something went wrong', code = 500, data = null) => {
    return res.status(code).json({
        code: code,
        message: message,
        data: data,
    });
};
