const functions = require('firebase-functions');
const admin = require("firebase-admin");
const serviceAccount = require("./indyperf-1-firebase-adminsdk-0xi2n-6122d65a90.json");
var amqp = require('amqplib/callback_api');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://indyperf-1.firebaseio.com"
});


exports.indy = functions.https.onRequest((req,res) => {

	if(req.method === 'POST') {
		admin.database().ref("/indy").push({
			time: Date.now(),
			value: req.body
		})
		.then(snapshot => {
			console.log("Connection to AMQP...");

			amqp.connect("amqp://vfujqvkx:xsyZHnPGRhMq8dfLld5mKhQFvyFqpYax@bear.rmq.cloudamqp.com:1883/vfujqvkx" , function(err,conn) {
				
				if(!err) {
					console.log("Creating Channel...");
					conn.createChannel(function(err, ch) {
						var q = "indy";
						ch.assertQueue(q,{durable:false});
						ch.sendToQueue(q, Buffer.from( JSON.stringify(req.body) )  );
						console.log(`[x] send message  '${req.body}' `);
					});
				} else {
					console.log('===>. ' , err);
				}
				
				res.status(200).send('pong');
			});
		});
	} else {
		admin.database().ref("/other").push({
			time: Date.now(),
			method: req.method,
			value: req.body
		});
	};
});