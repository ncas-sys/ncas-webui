var InterfaceController = require('./Interface.controller')



var Interface = angular.module('App.Interface', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider
		.state('Interface', {
			url:'/interface',
			views:{
				'main-view':{
					controller: 'InterfaceController as InterfaceCtrl',
					templateUrl: 'modules/Interface/Interface.tmpl.html'
				}
			}
		})
	;
}])

.controller('InterfaceController', ['$rootScope', 'ConnectionService', InterfaceController])