(function(){
	'use strict';
	var $ = require('jquery');
	require('angular');
	require('angular-route');
	require('angular-ui-router');
	require('angular-jwt');
	require('angular-inflector');
	require('moment');
	require('angular-moment');

	require('../modules/Interface/Interface.module')
	

	var Connection = require('../modules/services/Connection.service');

	var app = angular.module('App', [
		'ui.router',
		'angular-jwt',
		'App.Interface'
	])
	.run(['$rootScope', '$state', function($rootScope, $state){
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
			if(toState.name=='Redirect'){
				event.preventDefault();
				$state.go('Interface');
				return false;
			}
		});
	}])
	.config(['$httpProvider', 'jwtInterceptorProvider', '$stateProvider', '$urlRouterProvider', function Config($httpProvider, jwtInterceptorProvider, $stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('Redirect', { url:'' })
		;
		$urlRouterProvider.otherwise('/interface');
	}])
	.service('ConnectionService', ['$rootScope', Connection])


})();
