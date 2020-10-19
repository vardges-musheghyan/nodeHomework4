exports.getToken = function (req) {
    return req.headers.authorization.slice(7);
};

exports.getUsername = function (req) {
    return req.params.username;
};
