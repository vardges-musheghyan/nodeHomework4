const fs = require('fs');

const path = require('path');

const util = require('util');

const bcrypt = require('bcrypt');

const secretForToken = process.env.SECRETFORTOKEN || '#haghteluenq';

const jwt = require('jsonwebtoken');

const saltRounds = 10;

const readFile = util.promisify(fs.readFile);

const writeFile = util.promisify(fs.writeFile);

async function getDb() {
    const pathToDb = path.resolve(__dirname, 'db.json');
    return JSON.parse(await readFile(pathToDb));
}

async function setDb(file) {
    const pathToDb = path.resolve(__dirname, 'db.json');
    await writeFile(pathToDb, file);
}


exports.createUser = async function (user) {
    const {username, password, email} = user;
    const hashedPass = await bcrypt.hash(password, saltRounds);
    let db = await getDb();
    if (db[username]) {
        throw new Error('user exists');
    }
    db = {...db, [username]: {email, password: hashedPass, username}};
    const plainTextDb = JSON.stringify(db);
    await setDb(plainTextDb);
    return {username, email}
};

exports.login = async function (user) {
    const {username, password} = user;
    let db = await getDb();
    let dbUser = db[username];
    if (!dbUser){
        throw new Error('invalid password or username')
    }

    let success = await bcrypt.compare(password,dbUser.password);
    if (success){
        let token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: {username, email: dbUser.email}
        }, secretForToken);
        return token;
    }
    throw new Error('invalid username or password');

};

exports.getUser = async function (token) {
    let db = await getDb();
    const decoded = await jwt.verify(token, secretForToken);
    const username = decoded.data.username;
    const {password, ...user} = db[username];
    if (user.email === decoded.data.email){
        return  user;
    }
    throw new Error('unauthorized request');
};

exports.updateUser = async function(token, requestedUsername, userToBeUpdated){
    let db = await getDb();
    const decoded = await jwt.verify(token, secretForToken);
    if (requestedUsername === decoded.data.username){
        let user = db[requestedUsername];
        user = {...db[requestedUsername], ...userToBeUpdated};
        let {password, ...rest} = user;
        let plainTextDb = JSON.stringify(db);
        await setDb(plainTextDb);
        return rest;
    }
    throw new Error('unauthorized request');
};

exports.deleteUser = async function(username, token, password){
    let db = await getDb();
    const decoded = await jwt.verify(token, secretForToken);
    let ifPasswordCorrect = await bcrypt.compare(password, db[username].password);
    if (username === decoded.data.username && ifPasswordCorrect){
        delete db[username];
        let plainTextDb = JSON.stringify(db);
        await setDb(plainTextDb);
        return {};
    }
    throw new Error('unauthorized request');
};
