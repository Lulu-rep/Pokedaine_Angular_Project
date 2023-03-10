const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = "mongodb://localhost:27017";

exports.listeGet = async function (req, res) {
    try {
        if (req.session.user.id == req.params.id) {
            db = await MongoClient.connect(url);
            let dbo = db.db("taches");
            let user = await dbo.collection("utilisateur").findOne({ _id: new ObjectId(req.params.id) });
            const listesId = user.listesId.map(l => new ObjectId(l));
            let listeObject = await dbo.collection("listes").find({ _id: { $in: listesId } }).toArray();
            for (let i = 0; i < listeObject.length; i++) {
                const liste = listeObject[i];
                if (liste.taches) {
                    const taches = liste.taches.map(t => new ObjectId(t));
                    liste.tachesliste = await dbo.collection("taches").find({ _id: { $in: taches } }).toArray();
                }

            }
            res.status(200).json(listeObject);

        }
        else
            res.status(401).json({ message: 'Unauthorized' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
};

exports.listePost = async function (req, res) {
    let liste= req.body;
    try{
        db= await MongoClient.connect(url);
        let dbo = db.db("taches");
        await dbo.collection("listes").insertOne(liste);
        res.status(200).json(liste);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message: err});
    }
    db.close();
};

exports.listeDelete = async function (req, res) {
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        await dbo.collection("listes").deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
    db.close();
};

exports.listePut = async function (req, res) {
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        await dbo.collection("listes").updateOne({ _id: new mongodb.ObjectId(req.params.id) }, { $set: { titre: req.body.titre, taches: req.body.taches } });
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
};