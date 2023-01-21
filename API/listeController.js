const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = "mongodb://localhost:27017";

exports.listeGet = async function (req, res) {
    try{
        db= await MongoClient.connect(url);
        let dbo = db.db("taches");
        let listeObj = await dbo.collection("listes").find({}).toArray();
        for(let i=0; i<listeObj.length; i++){
            const liste = listeObj[i];
            if(liste.taches){
                const taches = liste.taches.map(tacheId => new ObjectId(tacheId));
                liste.taches = await dbo.collection("taches").find({_id: {$in: liste.taches}}).toArray();
            }
        }
        res.status(200).json(listeObj);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: err});
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