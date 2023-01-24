const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = "mongodb://127.0.0.1:27017/";

exports.signIn = async function (req, res) {
    let utilisateur = req.body;
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        await dbo.collection("utilisateur").insertOne(utilisateur);
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
}

exports.login = async function (req, res) {
    try {
        let utilisateur = req.body;
        db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        let utilisateurs = await dbo.collection("utilisateur").find({ login: utilisateur.login, password: utilisateur.password }).toArray();
        if (utilisateurs.length > 0) {
            req.session.user = { "name": utilisateur.login, "id": utilisateurs[0]._id };
            res.status(200).send();
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
}

exports.logout = async function (req, res) {
    if (req.session)
        await req.session.destroy();
    res.status(200).end();
}

exports.isConnected = async function (req, res) {
    res.status(200).end();
}

exports.register = async function (req, res) {
    let user = req.body;
    try {
        if (user.login == "" || user.password == "") {
            res.status(400).json({ message: 'Veuillez saisir un nom d utilisateur et/ou un mot de passe' });
            return
        }
        else {
            db = await MongoClient.connect(url);
            let dbo = db.db("taches");
            let users = await dbo.collection("utilisateur").find({ login: user.login }).toArray();
            if ( users.length > 0) {
                res.status(400).json({ message: 'Login invalide' });
                return
            }
            else {
                user.listesId = [];
                await dbo.collection("utilisateur").insertOne(user);
                res.status(200).send();
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
}