const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const imdb = require('./src/imdb');
const Random = require("random-js").Random;
const random = new Random()

const DENZEL_IMDB_ID = 'nm0000243';

const CONNECTION_URL = "mongodb+srv://Benitooo:mongodb@mongo-hjkc5.mongodb.net/test?retryWrites=true"

const DATABASE_NAME = "Denzeldb";


var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, collection, collectionReview;

app.listen(9292, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("Movies");
		collectionReview = database.collection("ReviewMovies")
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});


app.get("/Movies/populate", async(request, response) => {
	
	const AllMovies = await imdb(DENZEL_IMDB_ID);
    
	collection.insertMany(AllMovies, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
		var messageToSend = { "total":result.length }
        response.send(messageToSend);
    });
});

app.get("/Movies", (request, response) => {
    collection.find({ metascore: { $gt: 70 }}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        var messageToSend = result[random.integer(0, result.length-1)]
        response.send(messageToSend);
    });

});

app.get("/Movies/:id", (request, response) => {
    collection.findOne({ "id": request.params.id }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

// à voir
app.get("/Movies/search", (request, response) => {
    console.log(request.query.limit);
    console.log('Bonjour');
    console.log(request.query.metascore);
    response.send('Bonjour');
    /*collectionMovie.findOne({ "id": request.params.id }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });*/
});

// à revoir
app.post("/Movies/:id", (request, response) => {
    collectionReview.insert( request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});
