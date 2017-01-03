var express = require('express');
var Firebase = require('firebase');
var bodyParser = require('body-parser');
var port= process.env.PORT ||3000;

var app = express();

var config = {
	apiKey: "AIzaSyBTl501aneuEHtxky5_g6Etl_atYxPM80s",
    authDomain: "fir-test-6468b.firebaseapp.com",
    databaseURL: "https://fir-test-6468b.firebaseio.com",
    storageBucket: "fir-test-6468b.appspot.com",
    messagingSenderId: "439463118427"
};
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
Firebase.initializeApp(config);



app.post('/addts',function(req,res){
	var path=req.body.path;
	if(!path){
		res.send({'error':'path is not present'});
		return;
	}else{
		var reqRef=Firebase.database().ref(path);
		reqRef.set(Firebase.database.ServerValue.TIMESTAMP);
		res.send({'success':path+': updated with timestamp'});
	}

});

app.listen(port,function(){
	console.log("AppServer is listning on :"+port);
});
