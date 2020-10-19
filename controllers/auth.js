const {createUser, login} = require('../DB/dbfunctionality');



exports.register = async function (req,res,next) {
    try {
        let user = req.body;

        const createdUser = await createUser(user);
        res.status(201).json({success: true, data: createdUser})
    }catch (e) {
        if (e.message === 'user exists'){
            return res.status(400).json({
                success: false,
                message: 'username already in use'
            });
        }
        res.status(500).json({
            success: false,
            message: 'internal server error'
        })
    }

};

exports.login = async function(req,res,next) {
    try {
        let user = req.body;
        const token = await login(user);
        res.status(200).json({success: true, data: {token}})
    }catch (e) {
        res.status(500).json({
            success: false,
            message: 'internal server error'
        })
    }
};
