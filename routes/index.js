
const express = require("express");
const passport = require("passport");
const router = express.Router();
const authUtils = require("../utils/auth");
const myDB = require("../db/myMongoDB.js");
const { MongoClient } = require("mongodb");
require("dotenv").config();

router.post("/login",
	passport.authenticate("local", {
		failureRedirect: "/signin?error=Invalid username or password.",
	}),
	function (req, res) {
		console.log('what is my user', req.user);
		delete req.user['password'];
		res.json(req.user);
	}
);

router.post("/register", async (req, res, next) => {
	const url = process.env.MONGO_URL || "localhost:27017/apts";
  console.log('file: index.js ~ line 22 ~ router.post ~ url', url);
	const client = await new MongoClient(url, { useUnifiedTopology: true });
	const { username, password, first_name, last_name } = req.body;
	await client.connect();
	const db = client.db("apts");
	const User = db.collection("user");
	const found = await User.findOne({ username });
  console.log('file: index.js ~ line 28 ~ router.post ~ found', found);
	if (found) {
			res.status(500);
			client.close();
			res.send("Registration failed, please try again later");

	}  else {
			const result = await User.insertOne(
				{ username, password: authUtils.encrypt(password), first_name, last_name, favorites: [] },
			);
			const user = result.ops[0];
			delete user.password
			res.json(user);
		}
});


router.get("/filter", async (req, res) => {
	const fapartments = await myDB.filterProperties();
	res.json(fapartments);

});

router.get("/apts", async (req, res) => {
	const gapartment = await myDB.getProperties();
	res.json(gapartment);
});
router.get("/apt/:aptId", async (req, res) => {
	const apartment = await myDB.getAptById(req.params.aptId);
	res.json(apartment);
});


router.get("/signout", (req, res) => {
	req.session.destroy();
	res.json("successfully logged out");
});

router.post("/favorite/:aptId", async (req, res) => {
	let apartment = req.params.aptId;
	let user = req.user;
	console.log('req user in favorites', req.user)
	await myDB.addFavorite(user, apartment);
	res.json('successful'); // redirect to home page
});

router.put("/removeFav/:aptId", async (req, res) => {
	let apartment = req.params.aptId;
	let user = req.user
	await myDB.removeFavorite(user, apartment);
	res.json("successful"); 
});

router.post("/favorites", async (req, res) => {
	const favs = await myDB.getFavorites(req.body.favorites);
	res.json(favs);
});

router.get("/user", async (req, res) => {
	console.log(req.user);
	if (!req.user) {
		res.json('no user found');
	}
	res.json(req.user);
});

module.exports = router;