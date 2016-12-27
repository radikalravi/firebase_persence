angular.module('app',[
	'ui.materialize'
]).config(function(){
	var config = {
    apiKey: "AIzaSyDUDzkYWTIep37ttZRQLPkP-r4nu4fwdlE",
    authDomain: "game-839d8.firebaseapp.com",
    databaseURL: "https://game-839d8.firebaseio.com",
    storageBucket: "game-839d8.appspot.com",
    messagingSenderId: "652923527177"
  };
  firebase.initializeApp(config);

}).controller('Main',function($scope,$timeout,$interval,$http){
	//$scope.ApiEndPoint = "http://localhost:3000"
	$scope.auth = firebase.auth();
	$scope.db = firebase.database().ref();
	$scope.usersRef = $scope.db.child('users');
	var connectedRef = firebase.database().ref(".info/connected");
	$scope.isLoggedIn=false;
	$scope.mode='signinmode';

	$scope.convToTime = function(timestamp){
		return Date(timestamp);
	};

	// $interval(function(){
	// 	$scope.heartbeat=$scope.heartbeat+1||0;
	// 	if($scope.isLoggedIn){
	// 		var data={
	// 			path:'users/'+$scope.userId+'/lastSeen'
	// 		};
	// 		//todo write code to update timestamp via api endpoint
	//
	// 		/*
	// 		$scope.usersRef.child($scope.userId).child('online').set(true);
	// 		$scope.usersRef.child($scope.userId).child('lastSeen').set(firebase.database.ServerValue.TIMESTAMP);
	// 		*/
	// 	}
	// },1000);

	connectedRef.on("value", function(snap) {
		console.log($scope.isLoggedIn);
		if (snap.val() === true) {
			if($scope.isLoggedIn){

				//$scope.usersRef.child($scope.userId).child('lastSeen').set(firebase.database.ServerValue.TIMESTAMP);
				//$scope.usersRef.child($scope.userId).child('online').onDisconnect().set(false);
			}
		} else {
			alert("not connected");
			if($scope.isLoggedIn){
				///$scope.usersRef.child($scope.userId).child('online').set(true);
				//$scope.usersRef.child($scope.userId).child('online').onDisconnect().set(false);
			}
		}
	});
	$scope.usersRef.on('value',function(userSnap){
		$timeout(function(){
			$scope.users=userSnap.val();
		},0);
	});

	$scope.logout=function(){
		$scope.auth.signOut().then(function(){
			console.log("logged out");
		});
	};


	$scope.signin = function(user){
		$scope.auth.signInWithEmailAndPassword(user.email,user.password).then(function(userData){}).catch(function(err){
			//console.log(err);
			$timeout(function(){
				$scope.err=err;
			},0);
		});
	};
	var afterLogin = function(user){
		$scope.userId=user.uid;
		$scope.userRef=$scope.usersRef.child($scope.userId).set({
			email:user.email
		});
	};


	$scope.auth.onAuthStateChanged(function(user){
		//alert('auth state change');
		if(user){
			$timeout(function(){
				$scope.isLoggedIn=true;
				afterLogin(user);
			},0);
		}else{
			$timeout(function(){
				$scope.isLoggedIn=false;
			},0);
		}
	});
	$scope.signup = function(user){
		$scope.auth.createUserWithEmailAndPassword(user.email,user.password).then(function(userData){}).catch(function(err){

			$timeout(function(){
				$scope.err=err;
			},0);

		});
	};


});
