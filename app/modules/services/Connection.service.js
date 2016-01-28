module.exports = function ($rootScope) {
	var io = require('socket.io-client');
	var socket = io.connect('ws://178.62.100.233:45654');
	//var socket = io.connect('192.168.20.2:5656');
	
	var myId = null;

	socket.on('connect', function(sock){
		var obj = {
			name: 'WallController',
			type: 'controller',
			locale: 'internal'
		}
		socket.emit('Register', obj)
		$rootScope.$emit('UpdateMyStatus', 'detatched')
	})
	socket.on('WelcomeController', function(obj){
		$rootScope.$emit('UpdateMyStatus', 'connected');
		myId = obj;
		socket.emit('ToMaster', {
			event: 'GiveMeEverything'
		})
	})

	socket.on('UpdateState', function(obj){
		$rootScope.$emit('UpdateState', obj);
	})

	socket.on('NoCode', function(obj){
		$rootScope.$emit('CodeError');
	})
	socket.on('Error', function(obj){
		$rootScope.$emit('Error', obj);
	})

	socket.on('CodeSuccess', function(obj){
		$rootScope.$emit('CodeSuccess');
	})
	
	socket.on('UpdateControllerAuth', function(obj){
		$rootScope.$emit('UpdateControllerAuth', obj);
	})


	socket.on('disconnect', function(){
		$rootScope.$emit('ClearStates');
		$rootScope.$emit('UpdateMyStatus', 'offline')

	})
	socket.on('MasterConnectionLost', function(){
		$rootScope.$emit('ClearStates');
		$rootScope.$emit('UpdateMyStatus', 'detatched')
	})



	return {
		getMyId: function(){
			return myId
		},
		emit: function(name, obj){
			socket.emit(name, obj);
		}
	}
}