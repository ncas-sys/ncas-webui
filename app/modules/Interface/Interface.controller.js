module.exports = function($rootScope, ConnectionService, $timeout){
	
	InterfaceCtrl = this;
	InterfaceCtrl.locked = false;
	InterfaceCtrl.auth = 'none';
	InterfaceCtrl.enteredPassword = '';
	InterfaceCtrl.halt = false;
	InterfaceCtrl.showAuth = false;
	InterfaceCtrl.CodeError = false;
	InterfaceCtrl.showError = null;
	InterfaceCtrl.showMacros = false;
	InterfaceCtrl.showLightingPresets = false;

	InterfaceCtrl.confirmCallback = null;
	InterfaceCtrl.highlight = {
		password1: false
	}

	InterfaceCtrl.states = {
		connection: null,
		auditTemp: null,
		domes: null,
		sweeps: null,
		emo: null,
		heaters: null,
		beams: null,
		sidelights: null,
		projectorPower: null,
		projectorShutter: null,
		extractors: null,
		lightingScene: null
	}




	InterfaceCtrl.items = [
		{
			key: 'domes',
			icon: 'fa fa-lightbulb-o ',
			title: 'Dome Lights',
			status: 'not connected',
			class: "none",
			options: [
				{
					'title': 'Turn On',
					'emit': 'DomesOn',
					'icon': 'fa fa-power-off'
				},
				{
					'title': 'Turn Off',
					'emit': 'DomesOff',
					'icon': 'fa fa-power-off'
				}
			]
		},
		{
			key: 'emo',
			icon: 'fa fa-bolt ',
			title: 'Emo Power',
			status: 'not connected',
			class: "none",
			options: [
				{
					'title': 'Turn On',
					'emit': 'EmoOn',
					'icon': 'fa fa-power-off'
				},
				{
					'title': 'Turn Off',
					'emit': 'EmoOff',
					'icon': 'fa fa-power-off'
				}
			]
		},
		{
			key: 'sweeps',
			icon: 'fa fa-asterisk ',
			title: 'Sweep Fans',
			status: 'not connected',
			class: "none",
			options: [
				{
					'title': 'Turn On',
					'emit': 'SweepsOn',
					'icon': 'fa fa-power-off'
				},
				{
					'title': 'Turn Off',
					'emit': 'SweepsOff',
					'icon': 'fa fa-power-off'
				}
			]
		},
		{
			key: 'extractors',
			icon: 'fa fa-arrow-circle-o-up ',
			title: 'Extractors',
			status: 'not connected',
			class: "none",
			options: [
				{
					'title': 'Turn On',
					'emit': 'ExtractorsOn',
					'icon': 'fa fa-power-off'
				},
				{
					'title': 'Turn Off',
					'emit': 'ExtractorsOff',
					'icon': 'fa fa-power-off'
				}
			]
		},
		{
			key: 'sidelights',
			icon: 'fa fa-paragraph ',
			title: 'Side Lights',
			status: 'not connected',
			class: "none",
			options: [
				{
					'title': 'Turn On',
					'emit': 'SideLightsOn',
					'icon': 'fa fa-power-off'
				},
				{
					'title': 'Turn Off',
					'emit': 'SideLightsOff',
					'icon': 'fa fa-power-off'
				}
			]
		},
		{
			key: 'lighting',
			icon: 'fa fa-sliders ',
			title: 'Lighting Scenes',
			status: 'not connected',
			class: "none",
			options: [
				{
					'title': 'House Lights',
					'emit': 'LightingScene1',
					'icon': 'fa fa-sliders'
				},
				{
					'title': 'Stage Wash',
					'emit': 'LightingScene2',
					'icon': 'fa fa-sliders'
				},
				{
					'title': 'Black Out',
					'emit': 'LightingScene3',
					'icon': 'fa fa-sliders'
				},
				{
					'title': 'Conference',
					'emit': 'LightingScene6',
					'icon': 'fa fa-sliders'
				}
			]
		}
	]
	

	InterfaceCtrl.passwordEntry = function(number){
		if(!InterfaceCtrl.halt){
			InterfaceCtrl.highlight['password' + number] = true;
			InterfaceCtrl.enteredPassword = InterfaceCtrl.enteredPassword + number;
			if(InterfaceCtrl.enteredPassword.length==4){
				InterfaceCtrl.halt = true;
				var password = angular.copy(InterfaceCtrl.enteredPassword);
				ConnectionService.emit('ToMaster', {
					event: 'code',
					load: password
				})
				$timeout(function(){
					InterfaceCtrl.enteredPassword = '';
				}, 1000);	
			}
			$timeout(function(){
				InterfaceCtrl.highlight['password' + number] = false;
			}, 200);
		}
	}

	InterfaceCtrl.authShower = function(){
		if(InterfaceCtrl.locked!=true){
			InterfaceCtrl.showAuth = true;
		}
	}
	InterfaceCtrl.authHider = function(){
		InterfaceCtrl.showAuth = false;
		InterfaceCtrl.enteredPassword = '';
	}

	InterfaceCtrl.logOut = function(){
		InterfaceCtrl.auth = 'none';
		ConnectionService.emit('ToMaster', {
			event: 'LogOut'
		});
	}

	InterfaceCtrl.Command = function(command, node){
		if(InterfaceCtrl.states[node]!=null || node==null){
			InterfaceCtrl.showConfirm = true;
			InterfaceCtrl.confirmCallback = function(){
				ConnectionService.emit('ToMaster', {
					event: 'command',
					load: command
				})
			}
		}
	}
	InterfaceCtrl.confirmAction = function(){
		InterfaceCtrl.confirmCallback();
		InterfaceCtrl.showConfirm = false;
		InterfaceCtrl.confirmCallback = null;
	}
	InterfaceCtrl.cancelAction = function(){
		InterfaceCtrl.showConfirm = false;
		InterfaceCtrl.confirmCallback = null;
	}


	$rootScope.$on('UpdateMyStatus', function(event, stat){
		InterfaceCtrl.states.connection = stat;
		if(stat=='offline' || stat=='detached' || stat==null){
			InterfaceCtrl.auth = 'none';
		}
		$rootScope.$apply();
	})

	$rootScope.$on('UpdateControllerAuth', function(event, obj){
		console.log(obj)
		var myId = ConnectionService.getMyId();
		if(obj.conn_id==myId){
			InterfaceCtrl.auth = obj.level;
			InterfaceCtrl.showAuth = false;
			InterfaceCtrl.enteredPassword = '';
			InterfaceCtrl.halt = false;
		}
		$rootScope.$apply();
	})

	$rootScope.$on('UpdateState', function(event, obj){
		if(obj.node!='connection'){
			InterfaceCtrl.states[obj.node] = obj.value;
			$rootScope.$apply();
		}
	})

	$rootScope.$on('CodeError', function(){
		InterfaceCtrl.CodeError = true;
		$timeout(function(){
			InterfaceCtrl.halt = false;
			InterfaceCtrl.CodeError = false;
		}, 1500);
	})

	$rootScope.$on('CodeSuccess', function(){
		InterfaceCtrl.showAuth = false;
		InterfaceCtrl.enteredPassword = '';
		InterfaceCtrl.halt = false;
		$rootScope.$apply();
	})

	$rootScope.$on('Error', function(event, obj){
		InterfaceCtrl.showError = obj.message;
		InterfaceCtrl.halt = true;
		$rootScope.$apply();
		$timeout(function(){
			InterfaceCtrl.showError = null;
		}, 3000);
	})

	$rootScope.$on('ClearStates', function(){
		InterfaceCtrl.auth = 'none';
		InterfaceCtrl.states = {
			connection: null,
			auditTemp: null,
			domes: null,
			sweeps: null,
			emo: null,
			heaters: null,
			beams: null,
			sidelights: null,
			projectorPower: null,
			projectorShutter: null,
			extractors: null,
			lightingScene: null
		}
		$rootScope.$apply();
	})

}

