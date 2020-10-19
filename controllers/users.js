const {getUser, updateUser, deleteUser} = require('../DB/dbfunctionality');
const {getToken, getUsername} = require('../utiles');

// @desc    gets a user
// @route   GET /api/users/:username
// @access  Private

exports.getUser = async function (req, res, next) {
    try {
        let token = getToken(req);
        let user = await getUser(token);
        let requestedUsername = getUsername(req);
        if (user.username === requestedUsername){
            return res.status(200).json({
                success: true, data: user
            })
        }
        return res.status(401).json({
            success: false, message: 'unauthorized request'
        })
    } catch (e) {
        if (e.message === 'jwt expired') {
            return res.status(400).json({success: false, message: 'token expired'})
        }
        if (e.message === 'unauthorized request') {
            return res.status(401).json({
                success: false, message: e.message
            })
        }
        res.status(500).json({
            success: false,
            message: 'internal server error'
        })

    }
};


// @desc    update a user
// @route   PUT /api/users/:username
// @access  Private

exports.updateUser = async function (req, res, next) {
    try{
        const userToBeUpdated = req.body;
        let requestedUsername = getUsername(req);
        const token = getToken(req);
        const user = await updateUser(token, requestedUsername, userToBeUpdated);
        return res.status(200).json({
            success: true,
            data: user
        })
    }catch (e) {
        const message = e.message;
        if (message === 'unauthorized request'){
            return res.status(401).json({
                success: false,
                message: message
            })
        }
        return res.status(500).json({
            success: false,
            message: 'internal server error'
        })
    }
};


// @desc    delete a user
// @route   PUT /api/users/:username
// @access  Private

exports.deleteUser = async function (req, res, next) {
    try{
        let password = req.body.password;
        const userToBeDeleted = getUsername(req);
        await deleteUser(userToBeDeleted, getToken(req), password);
        return res.status(200).json({
            success: true,
            message: 'user was deleted'
        })
    }catch (e) {
        if (e.message === 'unauthorized request'){
            return res.status(401).json({
                success: false,
                message: e.message
            })
        }
        return res.status(500).json({
            success: false,
            message: 'internal server error'
        })
    }

};




