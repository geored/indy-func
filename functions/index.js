const functions = require('firebase-functions');
const admin = require("firebase-admin");
const serviceAccount = require("./indyperf-1-firebase-adminsdk-0xi2n-6122d65a90.json");
var amqp = require('amqplib/callback_api');

admin.initializeApp({credential: admin.credential.cert(serviceAccount),databaseURL: "https://indyperf-1.firebaseio.com"});

exports.indy = functions.https.onRequest((req,res) => {
	if(req.method === 'POST') {
		return admin.database().ref("/indy").push({time: Date.now(),value: req.body, processed: false}).then(snapshot => {
				return res.status(200).send('pong');
		});
	} else {
		return admin.database().ref("/other").push({time: Date.now(),value: req.body, method: req.method}).then(snapshot => {
			return res.status(200).send('ok');
		});
	}
});
