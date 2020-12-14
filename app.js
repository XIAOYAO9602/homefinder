const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const Session = require("express-session");
const Passport = require("passport");
const Strategy = require("passport-local").Strategy;
const {MongoClient} = require("mongodb");
const authUtils = require("./utils/auth");
const myDB = require("./db/myMongoDB");
require("dotenv").config();

const app = express()
const uri = process.env.MONGO_URL || "mongodb://localhost:27017";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SESSION_SECRET || "session secret"));

app.use(
	Session({
		secret: process.env.SESSION_SECRET || "session secret",
		resave: true,
		saveUninitialized: true,
	})
);

Passport.use(
	new Strategy(
		async (username, password, done) => {
			const client = new MongoClient(uri, { useUnifiedTopology: true });
			await client.connect();
			const db = await client.db("apts");
			const users = db.collection("user");
			users.findOne({ username }, (err, user) => {
				if (err) {
					return done(err);
				}

				if (!user) {
					return done(null, false);
				}
				let newPass = authUtils.decrypt(user.password);
				if (password != newPass) {
					return done(null, false);
				}

				return done(null, user);
			});
		}
	)
);

Passport.serializeUser((user, done) => {
	done(null, user.username);
});

Passport.deserializeUser( async (username, done) => {
	const user = await myDB.getUser(username);
	done(null, user);

});

app.use(Passport.initialize());
app.use(Passport.session());

// app.use((req, res, next) => {
// 	res.locals.loggedIn = req.isAuthenticated();
// 	next();
// });


app.use("/api", indexRouter);

app.use(express.static(path.join(__dirname, "front/build")));
app.get("*", (request, response) => {
	response.sendFile(path.join(__dirname, "./front/build", "index.html"));
});


module.exports = app;
