module.exports = function ($rootScope) {
	var io = require('socket.io-client');
	var socket = io.connect('178.62.100.233:45654');
	

	socket.on('connect', function(sock){
		var obj = {
			name: 'Mobile',
			type: 'controller',
			locale: 'internal'
		}
		socket.emit('Register', obj)
		$rootScope.$emit('UpdateMyStatus', 'detatched')
	})
	socket.on('Welcome', function(obj){
		socket.emit('GiveMeEverything')
	})
	
	socket.on('WelcomeController', function(obj){
		$rootScope.$emit('UpdateMyStatus', 'connected')
	})
	socket.on('UpdateState', function(obj){
		$rootScope.$emit('UpdateState', obj);
	})
	


	socket.on('disconnect', function(){
		$rootScope.$emit('UpdateMyStatus', 'offline')
	})
	socket.on('MasterConnectionLost', function(){
		$rootScope.$emit('UpdateMyStatus', 'detatched')
	})



	return {
		sendMsg: function(emit){
			socket.emit('SendMsg', emit);
		}
	}
}