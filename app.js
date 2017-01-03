var express = require('express');
var Firebase = require('firebase');
var bodyParser = require('body-parser');
var port= 3000;

var app = express();

var config = {
	apiKey: "AIzaSyBILjsq_QSbE8X-H2tiSxJxX5i1AV139nI",
    authDomain: "monopoly-2ffc6.firebaseapp.com",
    databaseURL: "https://monopoly-2ffc6.firebaseio.com",
    storageBucket: "monopoly-2ffc6.appspot.com",
    messagingSenderId: "68477236556"
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
