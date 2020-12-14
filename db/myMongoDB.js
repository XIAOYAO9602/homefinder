const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

function MyDB() {
	const myDB = {};

	const uri = process.env.MONGO_URL || "mongodb://localhost:27017";

	myDB.initializeUsers = async () => {
		const client = new MongoClient(uri, { useUnifiedTopology: true });
		await client.connect();

		const db = client.db("apts");
		const users = db.collection("users");
		return users;
	};

	myDB.getUser = async (username) => {
		const client = new MongoClient(uri, { useUnifiedTopology: true });
		await client.connect();
		const db = client.db("apts");
		const users = db.collection("user");
		return users.findOne({username});
	};

	myDB.removeFavorite = async (user, apartment) => {
		const client = new MongoClient(uri, { useUnifiedTopology: true });
		await client.connect();
		const db = client.db("apts");
		const favs = db.collection("user");
		await favs.update({ _id: ObjectId(user._id) }, { $pull: { favorites: apartment } });
		return;
	};

	myDB.createFavorites = async (user) => {
		const client = new MongoClient(uri, { useUnifiedTopology: true });
		await client.connect();
		const db = client.db("apts");
		const favs = db.collection("user");
		const result = await favs.find({ _id: user }).toArray();
		if (result.length == 0) {
			await favs.insertOne({
				_id: user,
				favApt: ["025"],
			});
		}
		return;
	};

	myDB.getFavorites = async (favorites) => {
		console.log('favorites', favorites);
		const mappedIds = favorites.map(favorite => ObjectId(favorite));
		const client = new MongoClient(uri, { useUnifiedTopology: true });
		await client.connect();
		const db = client.db("apts");
		const apts = db.collection("apts");
		return apts.find({ _id : { $in : mappedIds }}).toArray();
	};

	myDB.addFavorite = async (user, aptId) => {
		const client = new MongoClient(uri, { useUnifiedTopology: true });
		await client.connect();
		const db = client.db("apts");
		const favorites = db.collection("user");
		await favorites.update({ _id: ObjectId(user._id) }, { $push: { favorites: aptId } });
		client.close();
		return;
	};

	myDB.getProperties = async () => {
		const client = new MongoClient(uri, { useUnifiedTopology: true });
		await client.connect();
		const db = client.db("apts"); // access pokemon db
		const properties = db.collection("apts"); // access pokemon collection
		const query = {};
		return properties
			.find(query)
			.sort({ _id: 1 })
			.toArray()
			.finally(() => client.close());
	};
	myDB.getAptById = async (aptId) => {
		const client = new MongoClient(uri, { useUnifiedTopology: true });
		await client.connect();
		const db = client.db("apts"); // access pokemon db
		const properties = db.collection("apts"); // access pokemon collection
		return properties.findOne({_id: ObjectId(aptId)})
	};

	myDB.filterProperties = async (substring) => {
		const client = new MongoClient(uri, { useUnifiedTopology: true });
		await client.connect();
		const db = client.db("apts");
		const properties = db.collection("apts");

		const result = await properties
			.find({
				$or: [
					{ postingbody: substring },
					{ postinginfo: substring },
					{ titletextonly: substring },
					{ mapaddress: substring },
				],
			})
			.toArray();
		if (result.length == 0) {
			client.close();
		} else {
			client.close();
			return result;
		}
	};
	return myDB;
} 

module.exports = MyDB();
