const mongodb = require('mongodb');
const { visitNode } = require('typescript');
const MongoClient = mongodb.MongoClient;
const url = "mongodb://127.0.0.1:27017/";
const ObjectId = mongodb.ObjectId;


exports.UserInfo = async function (req, res) {
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        let user = await dbo.collection("utilisateur").findOne({ _id: new ObjectId(req.session.user.id) });
        res.status(200).json({ _id: new mongodb.ObjectId(user._id), login: "", password: "", listesId: user.listesId });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
}

exports.userPut = async function (req, res) {
    console.log(req.body);
    try {
        if (req.session.user.id == req.params.id) {
            db = await MongoClient.connect(url);
            let dbo = db.db("taches");
            await dbo.collection("utilisateur").updateOne({ _id: new mongodb.ObjectId(req.params.id) }, { $set: { listesId: req.body.listesId } });
            res.status(200).send();
        }
        else
            res.status(401).json({ message: 'Unauthorized' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
}

